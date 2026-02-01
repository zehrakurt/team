import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../api/user.service';
import './Users.scss';
import { getRoleInfo } from '../../utils/roles';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await userService.getUsers();
        setUsers(fetchedUsers);
      } catch (err: any) {
        console.error('Users fetchUsers error:', err);
        if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          localStorage.removeItem('token');
          window.dispatchEvent(new Event('tokenChanged'));
          return;
        }
        setError(err.message || 'Kullanıcılar yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  if (loading) {
    return <div className="users-container"><p>Kullanıcılar Yükleniyor...</p></div>;
  }

  if (error) {
    return <div className="users-container"><p>Hata: {error}</p></div>;
  }

  return (
    <div className="users-container">
      <h1>Kullanıcılar</h1>
      <div className="users-grid">
        {users.map(user => {
          const roleInfo = getRoleInfo(user.role);
          const RoleIcon = roleInfo.icon;
          
          return (
            <div key={user.id} className="user-card">
              <div className="user-avatar">
                <RoleIcon style={{ color: roleInfo.color }} />
              </div>
              <div className="user-info">
                <h3 className="user-name">{user.firstName.toUpperCase()} {user.lastName.toUpperCase()}</h3>
                <p className="user-email">{user.email}</p>
                <span className="user-role" style={{ color: roleInfo.color }}>
                  {roleInfo.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Users; 