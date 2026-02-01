import React, { useState, useEffect } from 'react';
import { userService } from '../../api/user.service';
import './Settings.scss';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../Notification/ToastManager';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

const Settings: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    email: profile?.email || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const showToast = useToast().showToast;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userProfile = await userService.getProfile();
        setProfile(userProfile);
      } catch (err: any) {
        console.error('Settings fetchProfile error:', err);
        if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          localStorage.removeItem('token');
          window.dispatchEvent(new Event('tokenChanged'));
          return;
        }
        setError(err.message || 'Profil bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
      });
    }
  }, [profile]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    try {
      await userService.updateProfile(profile!.id, profileForm);
      setProfileSuccess('Profil başarıyla güncellendi.');
      showToast && showToast('success', 'Profil başarıyla güncellendi.');
      setEditProfile(false);
      setProfile({ ...profile!, ...profileForm });
    } catch (err: any) {
      setProfileError(err.message || 'Profil güncellenemedi.');
      showToast && showToast('error', err.message || 'Profil güncellenemedi.');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('Yeni şifreler eşleşmiyor.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Yeni şifre en az 6 karakter olmalı.');
      return;
    }
    try {
      await userService.changePassword(profile!.id, passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordSuccess('Şifre başarıyla değiştirildi. Lütfen tekrar giriş yapın.');
      showToast && showToast('success', 'Şifre başarıyla değiştirildi. Lütfen tekrar giriş yapın.');
      setTimeout(() => {
        userService.logout();
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      setPasswordError(err.message || 'Şifre değiştirilemedi.');
      showToast && showToast('error', err.message || 'Şifre değiştirilemedi.');
    }
  };

  if (loading) {
    return <div className="settings-container"><p>Profil Yükleniyor...</p></div>;
  }

  if (error) {
    return <div className="settings-container"><p>Hata: {error}</p></div>;
  }
  
  if (!profile) {
    return <div className="settings-container"><p>Profil bulunamadı.</p></div>;
  }

  return (
    <div className="settings-container">
      <h1>Ayarlar</h1>
      <div className="profile-info">
        <h2>Profil Bilgileri</h2>
        {editProfile ? (
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <label>
              Ad:
              <input type="text" name="firstName" value={profileForm.firstName} onChange={handleProfileChange} required />
            </label>
            <label>
              Soyad:
              <input type="text" name="lastName" value={profileForm.lastName} onChange={handleProfileChange} required />
            </label>
            <label>
              Email:
              <input type="email" name="email" value={profileForm.email} onChange={handleProfileChange} required />
            </label>
            <button type="submit">Kaydet</button>
            <button type="button" onClick={() => setEditProfile(false)}>İptal</button>
            {profileError && <p className="error-message">{profileError}</p>}
            {profileSuccess && <p className="success-message">{profileSuccess}</p>}
          </form>
        ) : (
          <>
            <p><strong>Ad:</strong> {profile.firstName.toUpperCase()}</p>
            <p><strong>Soyad:</strong> {profile.lastName.toUpperCase()}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Rol:</strong> {profile.role}</p>
            <button onClick={() => setEditProfile(true)}>Profili Düzenle</button>
          </>
        )}
      </div>
      <div className="password-change">
        <h2>Şifre Değiştir</h2>
        <form onSubmit={handlePasswordSubmit} className="password-form">
          <label>
            Mevcut Şifre:
            <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} required />
          </label>
          <label>
            Yeni Şifre:
            <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} required />
          </label>
          <label>
            Yeni Şifre (Tekrar):
            <input type="password" name="confirmNewPassword" value={passwordForm.confirmNewPassword} onChange={handlePasswordChange} required />
          </label>
          <button type="submit">Şifreyi Değiştir</button>
          {passwordError && <p className="error-message">{passwordError}</p>}
          {passwordSuccess && <p className="success-message">{passwordSuccess}</p>}
        </form>
      </div>
    </div>
  );
};

export default Settings; 