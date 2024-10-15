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

  const scrollRef = useRef(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    let isScrolling = false
    let startY: number;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isScrolling) return

      const currentY = e.touches[0].clientY
      const diff = startY - currentY
      const threshold = 10

      if (Math.abs(diff) > threshold) {
        isScrolling = true
        if (diff > 0) {
          scrollContainer?.scrollBy({ top: scrollContainer.offsetHeight, behavior: 'smooth' })
        } else {
          scrollContainer?.scrollBy({ top: -scrollContainer.offsetHeight, behavior: 'smooth' })
        }
        setTimeout(() => { isScrolling = false }, 500)
      }
    }

    scrollContainer?.addEventListener('touchstart', handleTouchStart)
    scrollContainer?.addEventListener('touchmove', handleTouchMove)

    return () => {
      scrollContainer?.removeEventListener('touchstart', handleTouchStart)
      scrollContainer?.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

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
          
          <h1 className="text-gray-800 text-2xl font-bold text-center mb-6">Welcome, {user.firstName}!</h1>
          
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <h3 className="text-gray-800 text-xl font-semibold mb-3">Your current points: {user.points}</h3>

            <div ref={scrollRef} className="max-h-32 overflow-y-auto pr-2 snap-y snap-mandatory">
              <div className="space-y-2">
                {[
                  { platform: 'YouTube', buttonStage: buttonStage1, onClick: handleButtonClick1, claim: handleClaim1 },
                  { platform: 'Twitter', buttonStage: buttonStage2, onClick: handleButtonClick2, claim: handleClaim2 }
                ].map(({ platform, buttonStage, onClick, claim }) => (
                  <div key={platform} className="snap-start py-2">
                    <div className="flex items-center justify-between bg-white rounded-full p-2 px-4 transition-all duration-300 hover:scale-105 focus:scale-105">
                      <span className="text-gray-700 text-sm">Check our {platform}!</span>
                      <button
                        onClick={buttonStage === 'check' ? onClick : claim}
                        className={`bg-gray-200 text-gray-700 px-4 py-1 rounded-full text-sm ${buttonStage === 'claimed' ? 'cursor-not-allowed' : ''}`}
                        disabled={buttonStage === 'claimed'}
                      >
                        {buttonStage === 'check' && 'Check'}
                        {buttonStage === 'claim' && 'Claim'}
                        {buttonStage === 'claimed' && 'Claimed'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-around">
            {[{ icon: Home, label: 'Home' }, { icon: Users, label: 'Friends' }, { icon: Wallet, label: 'Wallet' }].map(({ icon: Icon, label }) => (
              <button key={label} className="flex flex-col items-center">
                <Icon size={24} className="text-gray-400" />
                <span className="text-xs text-gray-400 mt-1">{label}</span>
              </button>
            ))}
          </div>

          <div className="mt-4">
            <h3 className="text-gray-800 text-lg font-semibold mb-2">Invite your friends!</h3>
            <button onClick={handleInvite} className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm w-full">
              Copy Invite Link
            </button>
            {notification && <p className="text-green-500 text-sm mt-2">{notification}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
