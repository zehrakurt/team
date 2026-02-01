import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import {
  faTachometerAlt,
  faProjectDiagram,
  faTasks,
  faUsers,
  faCogs,
  faSignOutAlt,
  faSpinner,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.scss';
import { userService } from '../../api/user.service';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

const Sidebar: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileData = await userService.getProfile();
        setUser(profileData);
        setError(null);
      } catch (err: any) {
        console.error('Sidebar fetchUserProfile error:', err);
        if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          localStorage.removeItem('token');
          window.dispatchEvent(new Event('tokenChanged'));
          return;
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    userService.logout();
  };

  if (loading) {
    return (
      <aside className="sidebar">
        <header className="profile-header">
          <div>
            <div className="profile-picture-placeholder">
              <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            </div>
            <p>Profil yükleniyor...</p>
          </div>
        </header>
        <nav className="side-navigation">
          <ul>
            <li><FontAwesomeIcon icon={faSpinner} spin /> Yükleniyor...</li>
          </ul>
        </nav>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <header className="profile-header">
        <div>
          {user ? (
            <div className="profile-picture-placeholder">
              {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="profile-picture-placeholder">
              U
            </div>
          )}
          <p>{user ? `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}` : 'Kullanıcı Adı Yüklenemedi'}</p>
          {user && <span className="user-role">{user.role}</span>}
          {!user && <span className="user-role">Rol Bilgisi Yüklenemedi</span>}
        </div>
      </header>
      <nav className="side-navigation">
        <ul>
          <li>
            <Link to="/dashboard">
              <FontAwesomeIcon icon={faTachometerAlt} /> Gösterge Panosu
            </Link>
          </li>
          <li>
            <Link to="/projects">
              <FontAwesomeIcon icon={faProjectDiagram} /> Projeler
            </Link>
          </li>
          <li>
            <Link to="/tasks">
              <FontAwesomeIcon icon={faTasks} /> Görevler
            </Link>
          </li>
          {user && user.role === 'ADMIN' && (
            <li>
              <Link to="/users">
                <FontAwesomeIcon icon={faUsers} /> Kullanıcılar
              </Link>
            </li>
          )}
          {user && user.role === 'ADMIN' && (
            <li>
              <Link to="/admin">
                <FontAwesomeIcon icon={faShieldAlt} /> Admin Paneli
              </Link>
            </li>
          )}
          <li>
            <Link to="/settings">
              <FontAwesomeIcon icon={faCogs} /> Ayarlar
            </Link>
          </li>
          <li>
            <a href="#" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Çıkış Yap
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
