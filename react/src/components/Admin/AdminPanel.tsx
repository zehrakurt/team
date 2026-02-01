import React, { useState, useEffect } from 'react';
import { adminService } from '../../api/admin.service';
import type { DashboardStats, AdminUser } from '../../api/admin.service';
import { getRoleInfo, getRoleLabel, ROLE_MAPPINGS } from '../../utils/roles';
import './AdminPanel.scss';
import { 
  FiUsers, 
  FiFolder, 
  FiCheckSquare, 
  FiClock, 
  FiUserPlus, 
  FiShield,
  FiEdit3,
  FiCheck,
  FiX,
  FiTrendingUp,
  FiAlertCircle
} from 'react-icons/fi';

const AdminPanel: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stats, usersData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllUsers()
      ]);
      setDashboardStats(stats);
      setUsers(usersData);
    } catch (err: any) {
      console.error('AdminPanel fetchData error:', err);
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('tokenChanged'));
        return;
      }
      setError(err.message || 'Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      const updatedUser = await adminService.updateUserRole(selectedUser.id, selectedRole);
      setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
      closeRoleModal();
    } catch (err: any) {
      setError(err.message || 'Rol güncellenirken bir hata oluştu.');
    }
  };

  const handleApproveUser = async (userId: number) => {
    try {
      const updatedUser = await adminService.approveUser(userId);
      setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    } catch (err: any) {
      setError(err.message || 'Kullanıcı onaylanırken bir hata oluştu.');
    }
  };

  const handleDisableUser = async (userId: number) => {
    try {
      const updatedUser = await adminService.disableUser(userId);
      setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    } catch (err: any) {
      setError(err.message || 'Kullanıcı devre dışı bırakılırken bir hata oluştu.');
    }
  };

  const openRoleModal = (user: AdminUser) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setShowRoleModal(true);
  };

  const closeRoleModal = () => {
    setShowRoleModal(false);
    setSelectedUser(null);
    setSelectedRole('');
  };

 
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showRoleModal) {
        closeRoleModal();
      }
    };

    if (showRoleModal) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [showRoleModal]);

  if (loading) {
    return <div className="admin-panel-loading"><div className="loader"></div><p>Admin Paneli Yükleniyor...</p></div>;
  }

  if (error) {
    return <div className="admin-panel-error"><p>⚠️ {error}</p></div>;
  }

  return (
    <div className="admin-panel-container">
      <header className="admin-header">
        <h1><FiShield /> Admin Paneli</h1>
        <p>Sistem yönetimi ve kullanıcı kontrolü</p>
      </header>

      {dashboardStats && (
        <section className="dashboard-stats">
          <h2><FiTrendingUp /> Sistem İstatistikleri</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"><FiUsers /></div>
              <div className="stat-content">
                <h3>Toplam Kullanıcı</h3>
                <span className="stat-value">{dashboardStats.totalUsers}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><FiFolder /></div>
              <div className="stat-content">
                <h3>Toplam Proje</h3>
                <span className="stat-value">{dashboardStats.totalProjects}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><FiCheckSquare /></div>
              <div className="stat-content">
                <h3>Toplam Görev</h3>
                <span className="stat-value">{dashboardStats.totalTasks}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><FiClock /></div>
              <div className="stat-content">
                <h3>Geciken Görevler</h3>
                <span className="stat-value">{dashboardStats.delayedTasks}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><FiUserPlus /></div>
              <div className="stat-content">
                <h3>Bu Ay Yeni Kullanıcı</h3>
                <span className="stat-value">{dashboardStats.newUsersThisMonth}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><FiAlertCircle /></div>
              <div className="stat-content">
                <h3>Aktif Projeler</h3>
                <span className="stat-value">{dashboardStats.activeProjects}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="user-management">
        <h2><FiUsers /> Kullanıcı Yönetimi</h2>
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Kullanıcı</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Projeler</th>
                <th>Kayıt Tarihi</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const roleInfo = getRoleInfo(user.role);
                const RoleIcon = roleInfo.icon;
                
                return (
                  <tr key={user.id}>
                    <td className="user-info">
                      <div className="user-avatar">
                        <RoleIcon style={{ color: roleInfo.color }} />
                      </div>
                      <span>{user.firstName.toUpperCase()} {user.lastName.toUpperCase()}</span>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className="role-badge" style={{ color: roleInfo.color }}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td>{user._count?.projects || 0}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="actions">
                      <button 
                        className="action-btn edit"
                        onClick={() => openRoleModal(user)}
                        title="Rol Düzenle"
                      >
                        <FiEdit3 />
                      </button>
                      {user.role === 'USER' && (
                        <button 
                          className="action-btn approve"
                          onClick={() => handleApproveUser(user.id)}
                          title="Kullanıcıyı Onayla"
                        >
                          <FiCheck />
                        </button>
                      )}
                      {user.role !== 'ADMIN' && (
                        <button 
                          className="action-btn disable"
                          onClick={() => handleDisableUser(user.id)}
                          title="Kullanıcıyı Devre Dışı Bırak"
                        >
                          <FiX />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {showRoleModal && selectedUser && (
        <div className="modal-overlay" onClick={closeRoleModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Rol Düzenle</h3>
            <p><strong>{selectedUser.firstName.toUpperCase()} {selectedUser.lastName.toUpperCase()}</strong> için rol seçin:</p>
            
            <div className="role-options">
              {Object.entries(ROLE_MAPPINGS).map(([role, info]) => {
                const RoleIcon = info.icon;
                return (
                  <label key={role} className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={selectedRole === role}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    />
                    <RoleIcon style={{ color: info.color }} />
                    <span className="role-label" style={{ color: info.color }}>
                      {info.label}
                    </span>
                    <span className="role-description">
                      {info.description}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={closeRoleModal}
              >
                İptal
              </button>
              <button 
                className="btn-save"
                onClick={handleRoleUpdate}
                disabled={!selectedRole}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 