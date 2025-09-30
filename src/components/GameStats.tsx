'use client'

import { Card, CardContent } from '@/components/ui/card'

interface GameState {
  score: number
  gamesPlayed: number
  bestStreak: number
  currentStreak: number
}

interface GameStatsProps {
  gameState: GameState
}

export function GameStats({ gameState }: GameStatsProps) {
  const winPercentage = gameState.gamesPlayed > 0 
    ? Math.round((gameState.score / gameState.gamesPlayed) * 100)
    : 0

  const getStreakEmoji = (streak: number): string => {
    if (streak === 0) return '😐'
    if (streak < 3) return '😊'
    if (streak < 5) return '🔥'
    if (streak < 8) return '🚀'
    return '👑'
  }

  const getWinRateEmoji = (percentage: number): string => {
    if (percentage === 0) return '🎲'
    if (percentage < 30) return '😅'
    if (percentage < 50) return '😊'
    if (percentage < 70) return '😎'
    if (percentage < 90) return '🔥'
    return '🏆'
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {/* Score */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-green-200 hover:shadow-xl transition-all">
        <CardContent className="p-4 text-center">
          <div className="text-3xl md:text-4xl font-bold text-green-600 mb-1">
            {gameState.score}
          </div>
          <div className="text-sm font-medium text-green-700 flex items-center justify-center gap-1">
            🎯 Wins
          </div>
        </CardContent>
      </Card>

      {/* Games Played */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-blue-200 hover:shadow-xl transition-all">
        <CardContent className="p-4 text-center">
          <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">
            {gameState.gamesPlayed}
          </div>
          <div className="text-sm font-medium text-blue-700 flex items-center justify-center gap-1">
            🎮 Played
          </div>
        </CardContent>
      </Card>

      {/* Current Streak */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-orange-200 hover:shadow-xl transition-all">
        <CardContent className="p-4 text-center">
          <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-1">
            {gameState.currentStreak}
          </div>
          <div className="text-sm font-medium text-orange-700 flex items-center justify-center gap-1">
            {getStreakEmoji(gameState.currentStreak)} Streak
          </div>
        </CardContent>
      </Card>

      {/* Win Rate or Best Streak */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-purple-200 hover:shadow-xl transition-all">
        <CardContent className="p-4 text-center">
          {gameState.gamesPlayed > 0 ? (
            <>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-1">
                {winPercentage}%
              </div>
              <div className="text-sm font-medium text-purple-700 flex items-center justify-center gap-1">
                {getWinRateEmoji(winPercentage)} Win Rate
              </div>
            </>
          ) : (
            <>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-1">
                {gameState.bestStreak}
              </div>
              <div className="text-sm font-medium text-purple-700">
                🏆 Best Streak
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Additional stats row for larger screens */}
      {gameState.gamesPlayed > 0 && (
        <>
          <Card className="hidden md:block bg-white/80 backdrop-blur-sm shadow-lg border-indigo-200 md:col-span-2 hover:shadow-xl transition-all">
            <CardContent className="p-4 text-center">
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-1">
                {gameState.bestStreak}
              </div>
              <div className="text-sm font-medium text-indigo-700">
                🏆 Best Win Streak
              </div>
            </CardContent>
          </Card>

          <Card className="hidden md:block bg-white/80 backdrop-blur-sm shadow-lg border-rose-200 md:col-span-2 hover:shadow-xl transition-all">
            <CardContent className="p-4 text-center">
              <div className="text-3xl md:text-4xl font-bold text-rose-600 mb-1">
                {gameState.gamesPlayed - gameState.score}
              </div>
              <div className="text-sm font-medium text-rose-700">
                💔 Losses
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}