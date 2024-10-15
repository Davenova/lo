'use client'

import { useEffect, useState } from 'react'
import { WebApp } from '@twa-dev/types'
import React from 'react'
import { Home, Users, Wallet } from 'lucide-react'

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp
    }
  }
}

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [inviterInfo, setInviterInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState('')
  const [inviteLink, setInviteLink] = useState('')
  const [invitedUsers, setInvitedUsers] = useState<string[]>([])

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
              setInviteLink(`https://t.me/miniappw21bot/cdprojekt/start?startapp=${data.user.telegramId}`)
              setButtonStage1(data.user.claimedButton1 ? 'claimed' : 'check')
              setButtonStage2(data.user.claimedButton2 ? 'claimed' : 'check')
              setInvitedUsers(data.user.invitedUsers || [])
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
      setTimeout(() => {
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

  const handleInvite = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink).then(() => {
        setNotification('Invite link copied to clipboard!')
        setTimeout(() => setNotification(''), 3000)
      }).catch(err => {
        console.error('Failed to copy: ', err)
        setNotification('Failed to copy invite link. Please try again.')
      })
    }
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  if (!user) return <div className="container mx-auto p-4">Loading...</div>

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-lg">
        <div className="bg-gray-200 h-32 rounded-b-[40px]"></div>

        <div className="px-6 py-4 -mt-16">
          <div className="w-24 h-24 mx-auto bg-gray-400 rounded-3xl mb-4"></div>

          <h2 className="text-gray-800 text-2xl font-bold text-center mb-6">Welcome, {user.firstName}!</h2>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <h3 className="text-gray-800 text-xl font-semibold mb-3">Daily Tasks...!</h3>

            <div className="space-y-2">
              {/* Button 1 for YouTube */}
              <div className="flex items-center justify-between bg-white rounded-full p-2 px-4">
                <span className="text-gray-700 text-sm">Follow Our Youtube!</span>
                <button
                  onClick={() => {
                    if (buttonStage1 === 'check') handleButtonClick1()
                    else if (buttonStage1 === 'claim') handleClaim1()
                  }}
                  disabled={buttonStage1 === 'claimed' || isLoading}
                  className={`bg-gray-200 text-gray-700 px-4 py-1 rounded-full text-sm ${
                    buttonStage1 === 'claimed' || isLoading ? 'cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Claiming...' : buttonStage1 === 'check' ? 'Check' : buttonStage1 === 'claim' ? 'Claim' : 'Claimed'}
                </button>
              </div>

              {/* Button 2 for Twitter */}
              <div className="flex items-center justify-between bg-white rounded-full p-2 px-4">
                <span className="text-gray-700 text-sm">Follow Our Twitter!</span>
                <button
                  onClick={() => {
                    handleButtonClick2()
                    handleClaim2()
                  }}
                  disabled={buttonStage2 === 'claimed'}
                  className={`bg-gray-200 text-gray-700 px-4 py-1 rounded-full text-sm ${
                    buttonStage2 === 'claimed' ? 'cursor-not-allowed' : ''
                  }`}
                >
                  {buttonStage2 === 'check' && 'Check'}
                  {buttonStage2 === 'claim' && 'Claim'}
                  {buttonStage2 === 'claimed' && 'Claimed'}
                </button>
              </div>
            </div>
          </div>

          {/* Invited By Section */}
          {user.invitedBy && (
            <div className="text-center mb-4">
              <p>Invited by: {user.invitedBy}</p>
            </div>
          )}

          {/* Invite Button */}
          <div className="py-2 px-4 rounded mt-4 bg-blue-500 hover:bg-blue-700">
            <button
              onClick={handleInvite}
              className="w-full text-white font-bold py-2 rounded"
            >
              Invite
            </button>
          </div>

          {/* Invited Users List */}
          {invitedUsers.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-2">Invited Users:</h2>
              <ul className="list-disc pl-5">
                {invitedUsers.map((user, index) => (
                  <li key={index}>{user}</li>
                ))}
              </ul>
            </div>
          )}

          {notification && (
            <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
              {notification}
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="flex justify-around mt-6">
            <button className="flex flex-col items-center">
              <Home size={24} className="text-gray-400" />
              <span className="text-xs text-gray-400 mt-1">Home</span>
            </button>
            <button className="flex flex-col items-center">
              <Users size={24} className="text-gray-400" />
              <span className="text-xs text-gray-400 mt-1">Friends</span>
            </button>
            <button className="flex flex-col items-center">
              <Wallet size={24} className="text-gray-400" />
              <span className="text-xs text-gray-400 mt-1">Wallet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
