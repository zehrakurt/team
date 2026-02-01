import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../../api/project.service';
import { userService } from '../../api/user.service';
import { useNotifications } from '../Notification/NotificationContext';
import Select from 'react-select';
import './Project.scss';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

const CreateProject: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [userIds, setUserIds] = useState<number[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  useEffect(() => {
    userService.getUsers()
      .then(setUsers)
      .catch((err: any) => {
        console.error('CreateProject fetchUsers error:', err);
        if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          localStorage.removeItem('token');
          window.dispatchEvent(new Event('tokenChanged'));
          return;
        }
        setUsers([]);
      });
  }, [navigate]);

  const userOptions = users.map(user => ({
    value: parseInt(user.id),
    label: `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}`
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setIsSuccess(false);

    try {
      const newProject = await projectService.createProject({
        name,
        description,
        startDate,
        endDate,
        userIds,
      });
      setMessage('Proje başarıyla oluşturuldu!');
      setIsSuccess(true);
      console.log('Oluşturulan Proje:', newProject);
      

      
      setTimeout(() => {
        navigate('/projects');
      }, 1500);
    } catch (err: any) {
      console.error('Proje oluşturulurken hata oluştu:', err);
      setMessage(err.response?.data?.message || err.message || 'Proje oluşturulurken bir hata oluştu.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-project-container">
      <h2>Yeni Proje Oluştur</h2>
      <form onSubmit={handleSubmit} className="create-project-form">
        <div className="form-group">
          <label htmlFor="projectName">Proje Adı:</label>
          <input
            type="text"
            id="projectName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="projectDescription">Açıklama:</label>
          <textarea
            id="projectDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            required
            disabled={loading}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Başlangıç Tarihi:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">Bitiş Tarihi:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="userIds">Projeye Atanacak Kullanıcılar:</label>
          <Select
            id="userIds"
            isMulti
            options={userOptions}
            value={userOptions.filter(option => userIds.includes(option.value))}
            onChange={selected => setUserIds(selected.map((opt: any) => opt.value))}
            isDisabled={loading}
            placeholder="Kullanıcı seçin..."
            classNamePrefix="react-select"
            styles={{
              control: (base) => ({
                ...base,
                background: '#2b3a4f',
                borderColor: '#2dcc70',
                color: '#fff',
                minHeight: '48px',
                boxShadow: 'none',
              }),
              multiValue: (base) => ({
                ...base,
                background: '#2dcc70',
                color: '#233342',
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: '#233342',
                fontWeight: 'bold',
              }),
              option: (base, state) => ({
                ...base,
                background: state.isSelected ? '#2dcc70' : '#233342',
                color: state.isSelected ? '#233342' : '#2dcc70',
                fontWeight: state.isSelected ? 'bold' : 'normal',
                cursor: 'pointer',
              }),
              menu: (base) => ({
                ...base,
                background: '#233342',
                color: '#2dcc70',
              }),
              input: (base) => ({
                ...base,
                color: '#fff',
              }),
              singleValue: (base) => ({
                ...base,
                color: '#fff',
              }),
            }}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Oluşturuluyor...' : 'Proje Oluştur'}
        </button>
        {message && (
          <p className={`form-message ${isSuccess ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateProject;