import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import api from '../api/axios';
import { USERS_API_URL } from '../config/api';

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  userIds: string[];
}

export default function UserListModal({ isOpen, onClose, title, userIds }: UserListModalProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userIds.length > 0) {
      setLoading(true);
      const fetchUsers = async () => {
        try {
          const requests = userIds.map((id) => api.get(`${USERS_API_URL}/profiles/id/${id}`));
          const responses = await Promise.all(requests);
          setUsers(responses.map((res) => res.data));
        } catch (err) {
          console.error('Failed to fetch user list', err);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [isOpen, userIds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden flex flex-col max-h-[400px]">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="w-6" /> {/* Spacer */}
          <h2 className="font-semibold">{title}</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto flex-grow">
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : users.length === 0 ? (
            <div className="p-10 text-center text-gray-500">No users found</div>
          ) : (
            users.map((user) => (
              <div
                key={user.userId}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <Link
                  to={`/profile/${user.username}`}
                  onClick={onClose}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                    {user.profilePicture && <img src={user.profilePicture} alt="" />}
                  </div>
                  <span className="font-semibold text-sm">{user.username}</span>
                </Link>
                <button className="text-blue-500 text-sm font-bold">Follow</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
