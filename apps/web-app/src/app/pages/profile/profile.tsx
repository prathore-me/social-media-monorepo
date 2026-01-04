import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './profile.module.css';
import { USERS_API_URL } from '../../../config/api';

export function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${USERS_API_URL}/profiles/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (err) {
        console.error('Could not fetch profile', err);
        setError(true);
      }
    };

    if (username) fetchProfileData();
  }, [username]);

  if (error) return <div className={styles.container}>User not found.</div>;
  if (!profile) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.avatarContainer}>
          <img
            src={profile.profilePic || 'https://via.placeholder.com/150'}
            alt="profile"
            className={styles.avatar}
          />
        </div>

        <section className={styles.infoSection}>
          <div className={styles.usernameRow}>
            <h2 className={styles.username}>{profile.username}</h2>
            <button className={styles.editButton}>Edit Profile</button>
          </div>

          <div className={styles.statsRow}>
            <span>
              <strong>0</strong> posts
            </span>
            <span>
              <strong>0</strong> followers
            </span>
            <span>
              <strong>0</strong> following
            </span>
          </div>

          <div className={styles.bioSection}>
            <span className={styles.fullName}>
              {profile.firstName} {profile.lastName}
            </span>
            <p className={styles.bioText}>{profile.bio || 'No bio yet.'}</p>
          </div>
        </section>
      </header>

      <hr className={styles.divider} />

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        <span className={styles.activeTab}>POSTS</span>
        <span>REELS</span>
        <span>TAGGED</span>
      </div>

      {/* Posts Grid */}
      <div className={styles.postsGrid}>
        {[1, 2, 3, 4, 5, 6].map((post) => (
          <div key={post} className={styles.postItem}>
            <img src={`https://picsum.photos/300/300?random=${post}`} alt="post" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
