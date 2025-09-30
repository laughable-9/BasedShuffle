'use client'

import { useState, useEffect } from 'react'
import { ShellGame } from '@/components/ShellGame'
import { GameStats } from '@/components/GameStats'
import { GameControls } from '@/components/GameControls'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { sdk } from "@farcaster/miniapp-sdk";

interface GameState {
  score: number
  gamesPlayed: number
  bestStreak: number
  currentStreak: number
}

export default function HomePage() {
    useEffect(() => {
      const initializeFarcaster = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100));
          if (document.readyState !== 'complete') {
            await new Promise(resolve => {
              if (document.readyState === 'complete') {
                resolve(void 0);
              } else {
                window.addEventListener('load', () => resolve(void 0), { once: true });
              }

            });
          }

          await sdk.actions.ready();
          console.log("Farcaster SDK initialized successfully - app fully loaded");
        } catch (error) {
          console.error('Failed to initialize Farcaster SDK:', error);
          setTimeout(async () => {
            try {
              await sdk.actions.ready();
              console.log('Farcaster SDK initialized on retry');
            } catch (retryError) {
              console.error('Farcaster SDK retry failed:', retryError);
            }

          }, 1000);
        }

      };
      initializeFarcaster();
    }, []);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    gamesPlayed: 0,
    bestStreak: 0,
    currentStreak: 0
  })
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [showInstructions, setShowInstructions] = useState<boolean>(true)

  const handleGameResult = (won: boolean): void => {
    setGameState(prev => {
      const newStreak = won ? prev.currentStreak + 1 : 0
      return {
        score: won ? prev.score + 1 : prev.score,
        gamesPlayed: prev.gamesPlayed + 1,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        currentStreak: newStreak
      }
    })
  }

  const resetGame = (): void => {
    setGameState({
      score: 0,
      gamesPlayed: 0,
      bestStreak: 0,
      currentStreak: 0
    })
    setIsPlaying(false)
  }

  const startGame = (): void => {
    setIsPlaying(true)
    setShowInstructions(false)
  }

  useEffect(() => {
    // Auto-hide instructions after 8 seconds
    const timer = setTimeout(() => {
      setShowInstructions(false)
    }, 8000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 pt-16 md:pt-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gray-800">
            🎪 Shell Game
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-6">
            Find the coin under the shuffling cups!
          </p>
        </div>

        {/* Game Controls */}
        <GameControls showInstructions={showInstructions} onToggleInstructions={setShowInstructions} />

        {/* Instructions Card */}
        {showInstructions && (
          <Card className="mb-6 bg-white/80 backdrop-blur-sm shadow-lg border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700 flex items-center gap-2">
                🎯 How to Play
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Watch as the coin is placed under a random cup
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Follow the cups as they shuffle quickly
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Click the cup you think has the coin
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Build up your winning streak!
                </li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Game Stats */}
        <GameStats gameState={gameState} />

        {/* Main Game Area */}
        <div className="mb-8">
          {!isPlaying ? (
            <div className="text-center py-12">
              <Button 
                onClick={startGame}
                size="lg"
                className="text-2xl px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold shadow-xl rounded-2xl transform hover:scale-105 transition-all"
              >
                🎮 Start Game
              </Button>
            </div>
          ) : (
            <ShellGame 
              onGameResult={handleGameResult}
              onGameEnd={() => setIsPlaying(false)}
            />
          )}
        </div>

        {/* Reset Button */}
        {gameState.gamesPlayed > 0 && (
          <div className="text-center">
            <Button 
              onClick={resetGame}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 shadow-md"
            >
              🔄 Reset Statistics
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}