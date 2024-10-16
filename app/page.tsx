'use client'

import { useEffect, useState } from 'react'
import { WebApp } from '@twa-dev/types'
import Link from 'next/link'

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp
    }
  }
}

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [inviterInfo, setInviterInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState('')

  // State for both buttons
  const [buttonStage1, setButtonStage1] = useState<'check' | 'claim' | 'claimed'>('check')
  const [buttonStage2, setButtonStage2] = useState<'check' | 'claim' | 'claimed'>('check')

  // New loading spinner state
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()

      const initDataUnsafe = tg.initDataUnsafe || {}

      if (initDataUnsafe.user) {
        fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...initDataUnsafe.user, start_param: initDataUnsafe.start_param || null })
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              setError(data.error)
            } else {
              setUser(data.user)
              setInviterInfo(data.inviterInfo)
              setButtonStage1(data.user.claimedButton1 ? 'claimed' : 'check')
              setButtonStage2(data.user.claimedButton2 ? 'claimed' : 'check')
            }
          })
          .catch(() => {
            setError('Failed to fetch user data')
          })
      } else {
        setError('No user data available')
      }
    } else {
      setError('This app should be opened in Telegram')
    }
  }, [])

  const handleIncreasePoints = async (pointsToAdd: number, buttonId: string) => {
    if (!user) return

    try {
      const res = await fetch('/api/increase-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegramId: user.telegramId, pointsToAdd, buttonId }),
      })
      const data = await res.json()
      if (data.success) {
        setUser({ ...user, points: data.points })
        setNotification(`Points increased successfully! (+${pointsToAdd})`)
        setTimeout(() => setNotification(''), 3000)
      } else {
        setError('Failed to increase points')
      }
    } catch {
      setError('An error occurred while increasing points')
    }
  }

  const handleButtonClick1 = () => {
    if (buttonStage1 === 'check') {
      window.open('https://youtu.be/xvFZjo5PgG0', '_blank')
      setButtonStage1('claim')
    }
  }

  const handleButtonClick2 = () => {
    if (buttonStage2 === 'check') {
      window.open('https://twitter.com', '_blank')
      setButtonStage2('claim')
    }
  }

  const handleClaim1 = () => {
    if (buttonStage1 === 'claim') {
      setIsLoading(true)
      handleIncreasePoints(5, 'button1')
      setTimeout (() => {
        setButtonStage1('claimed')
        setIsLoading(false)
      }, 3000)
    }
  }

  const handleClaim2 = () => {
    if (buttonStage2 === 'claim') {
      handleIncreasePoints(3, 'button2')
      setButtonStage2('claimed')
    }
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  if (!user) return <div className="container mx-auto p-4">Loading...</div>

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-between min-h-screen">
      <div className="bg-white w-full h-3/4 rounded-b-full flex flex-col items-center justify-center shadow-lg">
        <div className="bg-gray-300 w-24 h-24 rounded-full mb-4"></div>
        <p className="text-gray-800 text-2xl font-bold mb-12 mt-4">{user.points} PixelDogs</p>
        <div className="bg-white w-10/12 pt-6 pb-6 px-12 rounded-lg flex flex-col items-center shadow-md mt-12">
          <div className="bg-gray-200 text-center py-2  rounded-full mb-4 w-2/3 mx-auto">
            <p className="font-bold text-gray-600">Daily Tasks..!</p>
          </div>
          <div className="bg-gray-200 w-full p-4 rounded-lg flex justify-between items-center mb-4 glow-pink-on-hover transition duration-300">
            <p className="text-gray-800">Follow Our Youtube!</p>
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              onClick={handleButtonClick1}
              disabled={buttonStage1 === 'claimed'}
            >
              {isLoading ? 'Claiming...' : buttonStage1 === 'check' ? 'Check' : buttonStage1 === 'claim' ? 'Claim' : 'Claimed'}
          </div>
          <div className="bg-gray-200 w-full p-4 rounded-lg flex justify-between items-center mb-4 glow-green-on-hover transition duration-300">
            <p className="text-gray-800">Follow Our Twitter!</p>
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              onClick={() => {
            if (buttonStage1 === 'check') {
              handleButtonClick1()
            } else if (buttonStage1 === 'claim') {
              handleClaim1()
            }
          }}
              disabled={buttonStage1 === 'claimed' || isLoading}
          className={`w-full text-white font-bold py-2 rounded ${
            buttonStage1 === 'claimed' || isLoading ? 'cursor-not-allowed' : ''
          }`}
            >
              {buttonStage2 === 'check' ? 'Check' : buttonStage2 === 'claim' ? 'Claim' : 'Claimed'}
            </button>
          </div>
          <div className="bg-gray-200 w-full p-4 rounded-lg flex justify-between items-center glow-blue-on-hover transition duration-300">
            <p className="text-gray-800">Join Our Telegram!</p>
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              onClick={handleClaim1}
              disabled={buttonStage1 === 'claimed' || isLoading}
            >
              {isLoading ? 'Claiming...' : buttonStage1 === 'check' ? 'Check' : buttonStage1 === 'claim' ? 'Claim' : 'Claimed'}
            </button>
          </div>
        </div>
      </div>
      <button
        className="bg-gray-800 text-white w-10/12 p-8 rounded-full mt-8 mb-4 shadow-lg hover:bg-gray-900 transition duration-300"
        onClick={() => console.log('Farm PixelDogs...')}
      >
        Farm PixelDogs...
      </button>
      <div className="bg-white w-full py-4 flex justify-around items-center shadow-t-lg">
        <Link href="/invite">
          <a className="flex flex-col items-center text-gray-800">
            <i className="fas fa-home text-2xl"></i>
            <p className="text-sm">Home</p>
          </a>
        </Link>
        <Link href="/invite">
          <a className="flex flex-col items-center text-gray-800">
            <i className="fas fa-users text-2xl"></i>
            <p className="text-sm">Friends</p>
          </a>
        </Link>
        <Link href="/invite">
          <a className="flex flex-col items-center text-gray-800">
            <i className="fas fa-wallet text-2xl"></i>
            <p className="text-sm">Wallet</p>
          </a>
        </Link>
      </div>
    </div>
  )
}
