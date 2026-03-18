import { cn } from '@/lib/utils'

type RecordStatus = 'pending' | 'approved' | 'rejected' | 'flagged'

const statusConfig: Record<RecordStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-warning/15 text-warning border-warning/30',
  },
  approved: {
    label: 'Approved',
    className: 'bg-success/15 text-success border-success/30',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-destructive/15 text-destructive border-destructive/30',
  },
  flagged: {
    label: 'Flagged',
    className: 'bg-primary/15 text-primary border-primary/30',
  },
}

interface StatusBadgeProps {
  status: RecordStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
