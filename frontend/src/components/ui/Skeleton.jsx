import { motion } from 'framer-motion';

const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse ${className}`}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

// Shimmer placeholder for cards (e.g. scheme cards, complaints list)
Skeleton.Card = () => (
  <div className="border border-gray-100 dark:border-dark-border rounded-3xl p-5 bg-white dark:bg-dark-card space-y-4">
    <div className="flex justify-between items-start">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-12" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <div className="pt-2 border-t border-gray-50 dark:border-dark-border flex justify-between gap-4">
      <Skeleton className="h-3 w-1/4" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  </div>
);

// Shimmer placeholder for text lists
Skeleton.List = () => (
  <div className="space-y-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex gap-4 items-center">
        <Skeleton className="h-10 w-10 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
