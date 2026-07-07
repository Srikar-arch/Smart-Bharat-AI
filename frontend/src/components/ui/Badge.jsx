import { clsx } from 'clsx';

const VARIANTS = {
  saffron: 'bg-saffron-100 text-saffron-700 dark:bg-saffron-500/20 dark:text-saffron-300',
  navy: 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300',
  green: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300',
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
};

const SIZES = {
  xs: 'text-[10px] px-2 py-0.5 rounded-md',
  sm: 'text-xs px-2.5 py-0.5 rounded-full',
  md: 'text-xs px-3 py-1 rounded-full',
  lg: 'text-sm px-4 py-1.5 rounded-full',
};

const Badge = ({
  children,
  variant = 'gray',
  size = 'sm',
  icon,
  dot = false,
  pulse = false,
  className,
}) => (
  <span className={clsx(
    'inline-flex items-center gap-1 font-medium',
    VARIANTS[variant],
    SIZES[size],
    className
  )}>
    {dot && (
      <span className={clsx(
        'w-1.5 h-1.5 rounded-full bg-current',
        pulse && 'animate-pulse'
      )} />
    )}
    {icon && <span>{icon}</span>}
    {children}
  </span>
);

// Status badges
Badge.Status = ({ status }) => {
  const STATUS_MAP = {
    pending: { variant: 'yellow', label: 'Pending', dot: true, pulse: true },
    open: { variant: 'saffron', label: 'Open', dot: true },
    'in-progress': { variant: 'navy', label: 'In Progress', dot: true, pulse: true },
    resolved: { variant: 'green', label: 'Resolved', dot: true },
    closed: { variant: 'gray', label: 'Closed', dot: true },
    rejected: { variant: 'red', label: 'Rejected', dot: true },
    active: { variant: 'green', label: 'Active', dot: true, pulse: true },
    inactive: { variant: 'gray', label: 'Inactive', dot: true },
    new: { variant: 'teal', label: 'New', dot: true },
    verified: { variant: 'green', label: 'Verified', dot: true },
  };

  const config = STATUS_MAP[status?.toLowerCase()] || { variant: 'gray', label: status };
  return <Badge variant={config.variant} dot={config.dot} pulse={config.pulse}>{config.label}</Badge>;
};

export default Badge;
