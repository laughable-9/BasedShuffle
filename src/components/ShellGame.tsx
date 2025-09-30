'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ShellGameProps {
  onGameResult: (won: boolean) => void
  onGameEnd: () => void
}

interface CupPosition {
  id: number
  x: number
  y: number
}

export function ShellGame({ onGameResult, onGameEnd }: ShellGameProps) {
  const [cups, setCups] = useState<CupPosition[]>([
    { id: 0, x: 0, y: 0 },
    { id: 1, x: 0, y: 0 },
    { id: 2, x: 0, y: 0 }
  ])
  // Track which cup ID has the coin, not position index
  const [coinCupId, setCoinCupId] = useState<number>(0)
  const [isShuffling, setIsShuffling] = useState<boolean>(false)
  const [gamePhase, setGamePhase] = useState<'placing' | 'shuffling' | 'guessing' | 'revealing'>('placing')
  const [selectedCup, setSelectedCup] = useState<number | null>(null)
  const [showCoin, setShowCoin] = useState<boolean>(true)
  const [message, setMessage] = useState<string>('Watch the coin!')
  const [shuffleCount, setShuffleCount] = useState<number>(0)
  const [totalShuffles, setTotalShuffles] = useState<number>(0)

  // Initialize cup positions and randomize coin position
  useEffect(() => {
    const initialCups: CupPosition[] = [
      { id: 0, x: -140, y: 0 },
      { id: 1, x: 0, y: 0 },
      { id: 2, x: 140, y: 0 }
    ]
    setCups(initialCups)
    
    // CRITICAL FIX: Randomize initial coin cup ID instead of always middle
    const randomCupId = Math.floor(Math.random() * 3)
    setCoinCupId(randomCupId)
  }, [])

  // Start game sequence
  useEffect(() => {
    const startSequence = async (): Promise<void> => {
      // Phase 1: Show coin placement
      setGamePhase('placing')
      setShowCoin(true)
      setMessage('🪙 Here\'s the coin!')
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Phase 2: Hide coin and start shuffling
      setShowCoin(false)
      setMessage('👀 Watch carefully...')
      setGamePhase('shuffling')
      
      await new Promise(resolve => setTimeout(resolve, 300))
      await shuffleCups()
      
      // Phase 3: Let player guess
      setGamePhase('guessing')
      setMessage('🤔 Where is the coin?')
    }

    startSequence()
  }, [])

  const shuffleCups = async (): Promise<void> => {
    setIsShuffling(true)
    // CRITICAL FIX: Max 5 shuffles instead of 8-11
    const numberOfShuffles = 3 + Math.floor(Math.random() * 3) // 3-5 shuffles
    setTotalShuffles(numberOfShuffles)
    
    for (let i = 0; i < numberOfShuffles; i++) {
      setShuffleCount(i + 1)
      await performShuffle()
      // CRITICAL FIX: Much faster - 200ms instead of 600ms
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    setIsShuffling(false)
    setShuffleCount(0)
  }

  const performShuffle = async (): Promise<void> => {
    const position1 = Math.floor(Math.random() * 3)
    let position2 = Math.floor(Math.random() * 3)
    
    // Ensure we're swapping different positions
    while (position2 === position1) {
      position2 = Math.floor(Math.random() * 3)
    }

    // CRITICAL FIX: Swap the cup IDs at these positions, not the positions themselves
    setCups(prev => {
      const newCups = [...prev]
      
      // Swap the cup IDs between the two positions
      const tempCup = { ...newCups[position1] }
      newCups[position1] = { ...newCups[position2] }
      newCups[position2] = tempCup
      
      // Update their visual positions to match their new array indices
      newCups[position1].x = position1 === 0 ? -140 : position1 === 1 ? 0 : 140
      newCups[position2].x = position2 === 0 ? -140 : position2 === 1 ? 0 : 140
      
      return newCups
    })

    // CRITICAL FIX: Faster animation - 300ms instead of 400ms
    return new Promise(resolve => setTimeout(resolve, 300))
  }

  const handleCupClick = (cupIndex: number): void => {
    if (gamePhase !== 'guessing' || isShuffling) return

    setSelectedCup(cupIndex)
    setGamePhase('revealing')
    
    // CRITICAL FIX: Check if the clicked cup ID matches the coin cup ID
    const clickedCupId = cups[cupIndex].id
    const won = clickedCupId === coinCupId
    
    if (won) {
      setMessage('🎉 Correct! You found the coin!')
    } else {
      // Find which position has the coin for the message
      const coinPosition = cups.findIndex(cup => cup.id === coinCupId)
      setMessage(`❌ Wrong! The coin was under cup ${coinPosition + 1}.`)
    }

    setShowCoin(true)
    onGameResult(won)

    // Show result for 2.5 seconds then end game
    setTimeout(() => {
      onGameEnd()
    }, 2500)
  }

  const getCupStyle = (cupIndex: number): React.CSSProperties => {
    const cup = cups[cupIndex]
    const isSelected = selectedCup === cupIndex
    // CRITICAL FIX: Check if this cup ID has the coin, not position index
    const hasCoin = cup.id === coinCupId && (showCoin || gamePhase === 'revealing')
    
    return {
      transform: `translateX(${cup.x}px) translateY(${cup.y}px)`,
      // CRITICAL FIX: Faster transition - 0.3s instead of 0.4s
      transition: isShuffling ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'transform 0.2s ease',
      filter: isSelected && gamePhase === 'revealing' 
        ? (hasCoin ? 'drop-shadow(0 0 25px rgb(34, 197, 94))' : 'drop-shadow(0 0 25px rgb(239, 68, 68))')
        : 'none'
    }
  }

  return (
    <div className="text-center">
      {/* Game Message */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {message}
        </h2>
        {isShuffling && (
          <div className="text-gray-600">
            <p className="text-lg font-medium">
              Shuffle {shuffleCount} of {totalShuffles}
            </p>
            <div className="w-64 mx-auto mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                style={{ width: `${(shuffleCount / totalShuffles) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Game Area */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-gray-200 p-8 mb-6 rounded-3xl">
        <div className="relative h-72 md:h-80 flex items-center justify-center">
          {/* Cups */}
          <div className="relative">
            {cups.map((cup, index) => (
              <div
                key={cup.id}
                className={`absolute cursor-pointer transition-all duration-200 ${
                  gamePhase === 'guessing' && !isShuffling 
                    ? 'hover:scale-110 hover:drop-shadow-xl' 
                    : ''
                }`}
                style={getCupStyle(index)}
                onClick={() => handleCupClick(index)}
              >
                {/* Cup */}
                <div className={`w-20 h-24 md:w-24 md:h-28 bg-gradient-to-b from-red-400 to-red-600 rounded-t-full border-4 border-red-700 shadow-lg ${
                  selectedCup === index && gamePhase === 'revealing' ? 'animate-bounce' : ''
                } ${gamePhase === 'guessing' && !isShuffling ? 'hover:shadow-xl' : ''}`}>
                  <div className="w-full h-3 bg-red-300 rounded-full mt-1"></div>
                  <div className="w-3/4 h-2 bg-red-200 rounded-full mt-1 mx-auto"></div>
                </div>
                
                {/* Coin */}
                {cup.id === coinCupId && showCoin && (
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full border-3 border-yellow-600 shadow-lg flex items-center justify-center animate-pulse">
                      <span className="text-xl md:text-2xl font-bold text-yellow-800">¢</span>
                    </div>
                  </div>
                )}

                {/* Cup number label for revealing */}
                {gamePhase === 'revealing' && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-gray-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Loading overlay during shuffling */}
          {isShuffling && (
            <div className="absolute inset-0 bg-blue-50/30 rounded-3xl flex items-center justify-center">
              <div className="text-gray-700 font-bold text-xl animate-pulse flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-gray-600">
          {gamePhase === 'placing' && (
            <p>The coin is being placed under a cup...</p>
          )}
          {gamePhase === 'shuffling' && (
            <p>Follow the cups carefully as they move around!</p>
          )}
          {gamePhase === 'guessing' && (
            <p>Click on the cup you think has the coin!</p>
          )}
          {gamePhase === 'revealing' && (
            <p>Game over! Starting a new round...</p>
          )}
        </div>
      </Card>

      {/* Mobile hint */}
      <div className="block md:hidden text-sm text-gray-500 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
        💡 Tap a cup to make your guess
      </div>
    </div>
  )
}