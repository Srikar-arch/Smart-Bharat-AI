import { clsx } from 'clsx';

const Avatar = ({ name, src, size = 'md', className, status }) => {
  const SIZES = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };

  const STATUS_COLORS = {
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    busy: 'bg-red-400',
    away: 'bg-yellow-400',
  };

  const initials = name
    ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className={clsx('relative inline-flex flex-shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className={clsx(
            'rounded-xl object-cover bg-gradient-to-br from-saffron-400 to-navy-600',
            SIZES[size]
          )}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div className={clsx(
          'rounded-xl bg-gradient-to-br from-saffron-400 to-navy-600 flex items-center justify-center text-white font-bold',
          SIZES[size]
        )}>
          {initials}
        </div>
      )}

      {status && (
        <span className={clsx(
          'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-dark-card',
          STATUS_COLORS[status] || 'bg-gray-400'
        )} />
      )}
    </div>
  );
};

export default Avatar;
