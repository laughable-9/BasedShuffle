'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface GameControlsProps {
  showInstructions: boolean
  onToggleInstructions: (show: boolean) => void
}

export function GameControls({ showInstructions, onToggleInstructions }: GameControlsProps) {
  return (
    <>
      {/* Desktop Control Box */}
      <div className="hidden md:block fixed top-4 left-4 z-10">
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-gray-200">
          <CardContent className="p-4">
            <div className="text-sm space-y-3">
              <div className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                🎮 <span>Controls</span>
              </div>
              <div className="text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">🖱️</span> Click cup to guess
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">👀</span> Track the coin
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-500">🎯</span> Find the coin
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200 mt-3">
                <Button
                  onClick={() => onToggleInstructions(!showInstructions)}
                  variant="outline"
                  size="sm"
                  className="text-xs w-full border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  {showInstructions ? '🙈 Hide Help' : '💡 Show Help'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Control Box */}
      <div className="block md:hidden fixed top-4 left-4 z-10">
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-gray-200">
          <CardContent className="p-3">
            <div className="text-xs space-y-2">
              <div className="font-bold text-gray-800 flex items-center gap-1">
                📱 <span>Controls</span>
              </div>
              <div className="text-gray-600 space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-blue-500">👆</span> Tap cup to guess
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-500">👀</span> Watch carefully
                </div>
              </div>
              <Button
                onClick={() => onToggleInstructions(!showInstructions)}
                variant="outline"
                size="sm"
                className="text-xs w-full mt-2 border-gray-300 text-gray-600 hover:bg-gray-50 h-6 transition-all"
              >
                {showInstructions ? '🙈' : '💡'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}