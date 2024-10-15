'use client'

import { useEffect, useState } from 'react'
import { WebApp } from '@twa-dev/types'

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Welcome, {user.firstName}!</h1>
      <div className="text-center mb-4">
        <p className="text-lg">Your current points: {user.points}</p>
      </div>

{/* Add a new section to display the invitedBy data */}
{user.invitedBy && (
  <div className="text-center mb-4">
    <p>Invited by: {user.invitedBy}</p>
  </div>
)}
      {/* First Button for YouTube */}
      <div
        className={`py-2 px-4 rounded mt-4 ${
          buttonStage1 === 'check'
            ? 'bg-green-500 hover:bg-green-700'
            : buttonStage1 === 'claim'
            ? 'bg-orange-500 hover:bg-orange-700'
            : 'bg-lightblue'
        }`}
      >
        <button
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
          {isLoading ? 'Claiming...' : buttonStage1 === 'check' ? 'Check' : buttonStage1 === 'claim' ? 'Claim' : 'Claimed'}
        </button>
      </div>

      {/* Second Button for Twitter */}
      <div
        className={`py-2 px-4 rounded mt-4 ${
          buttonStage2 === 'check'
            ? 'bg-green-500 hover:bg-green-700'
            : buttonStage2 === 'claim'
            ? 'bg-orange-500 hover:bg-orange-700'
            : 'bg-lightblue'
        }`}
      >
        <button
          onClick={() => {
            handleButtonClick2()
            handleClaim2()
          }}
          disabled={buttonStage2 === 'claimed'}
          className={`w-full text-white font-bold py-2 rounded ${
            buttonStage2 === 'claimed' ? 'cursor-not-allowed' : ''
          }`}
        >
          {buttonStage2 === 'check' && 'Check'}
          {buttonStage2 === 'claim' && 'Claim'}
          {buttonStage2 === 'claimed' && 'Claimed'}
        </button>
      </div>

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
    </div>
  )
}
