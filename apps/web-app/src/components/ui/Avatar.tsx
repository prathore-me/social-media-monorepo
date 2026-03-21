interface AvatarProps {
  src?: string;
  username?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-2xl',
};

export default function Avatar({ src, username, size = 'md' }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={username}
        className={`${sizes[size]} rounded-full object-cover bg-gray-200`}
      />
    );
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold`}>
      {username?.[0]?.toUpperCase() ?? '?'}
    </div>
  );
}
