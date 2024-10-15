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
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow overflow-y-auto">
        <div className="container mx-auto p-4 max-w-md">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-500 h-32 flex items-end justify-center pb-4">
              <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white"></div>
            </div>
            
            <div className="p-4">
              <h1 className="text-2xl font-bold text-center mb-2">Welcome, {user.firstName}!</h1>
              <p className="text-center text-gray-600 mb-4">Your current points: {user.points}</p>

              {user.invitedBy && (
                <p className="text-center text-gray-600 mb-4">Invited by: {user.invitedBy}</p>
              )}

              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <h2 className="text-xl font-semibold mb-3">Daily Tasks</h2>
                <div className="space-y-3">
                  <TaskButton
                    label="Check YouTube"
                    stage={buttonStage1}
                    isLoading={isLoading}
                    onClick={() => {
                      if (buttonStage1 === 'check') handleButtonClick1();
                      else if (buttonStage1 === 'claim') handleClaim1();
                    }}
                  />
                  <TaskButton
                    label="Check Twitter"
                    stage={buttonStage2}
                    onClick={() => {
                      handleButtonClick2();
                      handleClaim2();
                    }}
                  />
                  <TaskButton
                    label="Invite Friends"
                    onClick={handleInvite}
                    customClass="bg-blue-500 hover:bg-blue-600 text-white"
                  />
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
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-around">
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
      </footer>

      {notification && (
        <div className="fixed bottom-16 left-0 right-0 mx-auto w-max px-4 py-2 bg-green-100 text-green-700 rounded-full shadow-lg">
          {notification}
        </div>
      )}
    </div>
  );
}

interface TaskButtonProps {
  label: string;
  stage?: 'check' | 'claim' | 'claimed';
  isLoading?: boolean;
  onClick: () => void;
  customClass?: string;
}

function TaskButton({ label, stage, isLoading, onClick, customClass }: TaskButtonProps) {
  let buttonText = label;
  let buttonClass = customClass || '';

  if (stage) {
    buttonText = isLoading ? 'Claiming...' : stage === 'check' ? 'Check' : stage === 'claim' ? 'Claim' : 'Claimed';
    buttonClass = `${
      stage === 'check'
        ? 'bg-green-500 hover:bg-green-600 text-white'
        : stage === 'claim'
        ? 'bg-orange-500 hover:bg-orange-600 text-white'
        : 'bg-gray-200 text-gray-700'
    } ${stage === 'claimed' || isLoading ? 'cursor-not-allowed opacity-50' : ''}`;
  }

  return (
    <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
      <span className="text-gray-700">{label}</span>
      <button
        onClick={onClick}
        disabled={stage === 'claimed' || isLoading}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${buttonClass}`}
      >
        {buttonText}
      </button>
    </div>
  );
}
