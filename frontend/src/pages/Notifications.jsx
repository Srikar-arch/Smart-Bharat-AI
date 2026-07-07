import { motion } from 'framer-motion';
import { HiBell, HiCheckCircle, HiInformationCircle, HiExclamationCircle, HiX } from 'react-icons/hi';
import { useNotification } from '@/contexts/NotificationContext';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const ICONS = {
  success: HiCheckCircle,
  info: HiInformationCircle,
  warning: HiExclamationCircle,
  error: HiExclamationCircle,
};

const ICON_COLORS = {
  success: 'text-green-500 bg-green-100 dark:bg-green-900/30',
  info: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
  warning: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
  error: 'text-red-500 bg-red-100 dark:bg-red-900/30',
};

const Notifications = () => {
  const { inAppNotifs, markAsRead, markAllAsRead, unreadCount } = useNotification();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <PageHeader
          title="Notifications"
          subtitle={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
          icon={HiBell}
          actions={
            unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )
          }
        />

        <div className="space-y-3">
          {inAppNotifs.length === 0 ? (
            <Card className="text-center py-16">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="font-display font-bold text-gray-900 dark:text-white mb-2">All caught up!</h3>
              <p className="text-gray-500">No notifications yet. We'll notify you of important updates.</p>
            </Card>
          ) : (
            inAppNotifs.map((notif, i) => {
              const Icon = ICONS[notif.type] || HiInformationCircle;
              const iconClass = ICON_COLORS[notif.type] || ICON_COLORS.info;

              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card
                    className={`transition-all duration-300 cursor-pointer hover:shadow-md ${
                      !notif.read ? 'border-saffron-200 dark:border-saffron-500/30 bg-saffron-50/50 dark:bg-saffron-500/5' : ''
                    }`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`font-semibold text-sm ${notif.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                            {notif.title}
                            {!notif.read && <span className="ml-2 w-2 h-2 rounded-full bg-saffron-500 inline-block" />}
                          </p>
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {formatDistanceToNow(notif.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{notif.message}</p>
                        {notif.link && (
                          <Link to={notif.link} className="text-xs text-saffron-500 hover:text-saffron-600 font-semibold mt-1 inline-block">
                            View details →
                          </Link>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Notification settings */}
        <Card className="mt-8 bg-gray-50 dark:bg-dark-card" padding="lg">
          <h3 className="font-display font-bold text-gray-900 dark:text-white mb-2">Notification Preferences</h3>
          <p className="text-sm text-gray-500 mb-4">Manage what you want to be notified about.</p>
          <Link to="/profile" className="btn-outline text-sm py-2 px-4">Manage Preferences</Link>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
