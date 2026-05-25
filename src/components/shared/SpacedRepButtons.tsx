import { ReviewQuality } from '@/utils/sm2'
import { cn } from '@/lib/utils'

interface SpacedRepButtonsProps {
  onReview: (quality: ReviewQuality) => void
}

const buttons: { quality: ReviewQuality; label: string; color: string }[] = [
  { quality: 0, label: 'Again', color: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30' },
  { quality: 3, label: 'Hard', color: 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border-orange-500/30' },
  { quality: 4, label: 'Good', color: 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30' },
  { quality: 5, label: 'Easy', color: 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-blue-500/30' },
]

export function SpacedRepButtons({ onReview }: SpacedRepButtonsProps) {
  return (
    <div className="flex gap-2 mt-4">
      {buttons.map(({ quality, label, color }) => (
        <button
          key={quality}
          onClick={() => onReview(quality)}
          className={cn(
            'flex-1 py-2 px-3 rounded-md text-sm font-medium border transition-colors',
            color
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
