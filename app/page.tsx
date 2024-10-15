'use client'

import { useEffect, useState, useRef } from 'react'
import { WebApp } from '@twa-dev/types'
import { Home as HomeIcon, Users, Wallet } from 'lucide-react'

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
  const [buttonStage1, setButtonStage1] = useState<'check' | 'claim' | 'claimed'>('check')
  const [buttonStage2, setButtonStage2] = useState<'check' | 'claim' | 'claimed'>('check')
  const [isLoading, setIsLoading] = useState(false)

  // ... (all other functions remain the same: handleIncreasePoints, handleButtonClick1, handleButtonClick2, handleClaim1, handleClaim2, handleInvite)

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

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  if (!user) return <div className="container mx-auto p-4">Loading...</div>

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-center mb-4">Welcome, {user.firstName}!</h1>
          <p className="text-center text-gray-600 mb-4">Your current points: {user.points}</p>

          {user.invitedBy && (
            <p className="text-center text-gray-600 mb-4">Invited by: {user.invitedBy}</p>
          )}

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-3">Daily Tasks</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                <span className="text-gray-700">Check YouTube</span>
                <button
                  onClick={() => {
                    if (buttonStage1 === 'check') handleButtonClick1();
                    else if (buttonStage1 === 'claim') handleClaim1();
                  }}
                  disabled={buttonStage1 === 'claimed' || isLoading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    buttonStage1 === 'check'
                      ? 'bg-green-500 text-white'
                      : buttonStage1 === 'claim'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  } ${buttonStage1 === 'claimed' || isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {isLoading ? 'Claiming...' : buttonStage1 === 'check' ? 'Check' : buttonStage1 === 'claim' ? 'Claim' : 'Claimed'}
                </button>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                <span className="text-gray-700">Check Twitter</span>
                <button
                  onClick={() => {
                    handleButtonClick2();
                    handleClaim2();
                  }}
                  disabled={buttonStage2 === 'claimed'}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    buttonStage2 === 'check'
                      ? 'bg-green-500 text-white'
                      : buttonStage2 === 'claim'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  } ${buttonStage2 === 'claimed' ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {buttonStage2 === 'check' ? 'Check' : buttonStage2 === 'claim' ? 'Claim' : 'Claimed'}
                </button>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                <span className="text-gray-700">Invite Friends</span>
                <button
                  onClick={handleInvite}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white"
                >
                  Invite
                </button>
              </div>
            </div>
          </div>

          {invitedUsers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Invited Users:</h3>
              <ul className="list-disc pl-5 text-gray-600">
                {invitedUsers.map((invitedUser, index) => (
                  <li key={index}>{invitedUser}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-around mt-6">
            {[
              { icon: HomeIcon, label: 'Home' },
              { icon: Users, label: 'Friends' },
              { icon: Wallet, label: 'Wallet' }
            ].map(({ icon: Icon, label }) => (
              <button key={label} className="flex flex-col items-center">
                <Icon size={24} className="text-gray-400" />
                <span className="text-xs text-gray-400 mt-1">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {notification && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
          {notification}
        </div>
      )}
    </div>
  )
}
