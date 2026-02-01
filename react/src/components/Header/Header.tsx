import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faComments, faBell, faCode, faSearch, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { messageService } from '../../api/message.service';
import type { Message, User } from '../../api/message.service';
import { useNotifications } from '../Notification/NotificationContext';
import './Header.scss';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [showMessages, setShowMessages] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const { notifications, addNotification, markNotificationAsRead, unreadCount: notificationCount } = useNotifications();

  useEffect(() => {
    loadMessages();
    loadUsers();
    loadUnreadCount();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const userMessages = await messageService.getUserMessages();
      setMessages(userMessages);
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      console.log('Kullanıcılar yükleniyor...');
      const allUsers = await messageService.getAllUsers();
      console.log('Yüklenen kullanıcılar:', allUsers);
      setUsers(allUsers);
    } catch (error: any) {
      console.error('Kullanıcılar yüklenirken hata:', error);
      console.error('Hata detayı:', error.message);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const { count } = await messageService.getUnreadMessageCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Okunmamış mesaj sayısı yüklenirken hata:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Aranan:', searchQuery);
      alert(`"${searchQuery}" için arama yapılıyor...`);
      setSearchQuery('');
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedUser) {
      try {
        const message = await messageService.createMessage({
          content: newMessage,
          receiverId: parseInt(selectedUser)
        });
        
        setMessages(prev => [message, ...prev]);
        setNewMessage('');
        setSelectedUser('');
        loadUnreadCount(); 
        
        
        const receiver = users.find(user => user.id.toString() === selectedUser);
        if (receiver) {
          addNotification(
            'message',
            'Mesaj Gönderildi',
            `${receiver.firstName.toUpperCase()} ${receiver.lastName.toUpperCase()} kullanıcısına mesaj gönderildi.`
          );
        }
      } catch (error) {
        console.error('Mesaj gönderilirken hata:', error);
        alert('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
      }
    }
  };

  const markMessageAsRead = async (messageId: number) => {
    try {
      await messageService.markMessageAsRead(messageId);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
      loadUnreadCount(); 
    } catch (error) {
      console.error('Mesaj okundu olarak işaretlenirken hata:', error);
    }
  };

  const getSenderName = (message: Message) => {
    return `${message.sender.firstName.toUpperCase()} ${message.sender.lastName.toUpperCase()}`.trim() || message.sender.email;
  };

  const getReceiverName = (message: Message) => {
    return `${message.receiver.firstName.toUpperCase()} ${message.receiver.lastName.toUpperCase()}`.trim() || message.receiver.email;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const unreadMessagesCount = messages.filter(m => !m.isRead).length;

  return (
    <header className="main-head">
      <div className="header-left">
        <div className="icons">
          <div className="icon-wrapper" onClick={() => setShowMessages(!showMessages)}>
            <FontAwesomeIcon icon={faComments} />
            {unreadCount > 0 && (
              <span className="number-alert">{unreadCount}</span>
            )}
          </div>
          <div className="icon-wrapper" onClick={() => setShowNotifications(!showNotifications)}>
            <FontAwesomeIcon icon={faBell} />
            {notificationCount > 0 && (
              <span className="number-alert">{notificationCount}</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="logo">
        <FontAwesomeIcon icon={faCode} />
      </div>
      
      <div className="header-right">
        <form className="search" onSubmit={handleSearch}>
          <div className={`search-container ${isSearchFocused ? 'focused' : ''}`}>
            <input
              type="text"
              name="search"
              placeholder="Proje, görev veya kullanıcı ara..."
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <button type="submit" className="search-btn">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </form>
      </div>

      {/* Mesajlaşma Modal */}
      {showMessages && (
        <div className="modal-overlay" onClick={() => setShowMessages(false)}>
          <div className="modal-content messages-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Mesajlar</h3>
              <button className="close-btn" onClick={() => setShowMessages(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="messages-list">
              {loading ? (
                <div className="loading">Mesajlar yükleniyor...</div>
              ) : messages.length === 0 ? (
                <div className="no-messages">Henüz mesajınız yok.</div>
              ) : (
                messages.map(message => (
                  <div 
                    key={message.id}
                    className={`message-item ${!message.isRead ? 'unread' : ''}`}
                    onClick={() => markMessageAsRead(message.id)}
                  >
                    <div className="message-header">
                      <strong>{getSenderName(message)}</strong>
                      <span className="message-time">
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                    <p>{message.content}</p>
                  </div>
                ))
              )}
            </div>
            
            <div className="send-message">
              <select
                className="user-select"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Kullanıcı seçin...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.firstName.toUpperCase()} {user.lastName.toUpperCase()}
                  </option>
                ))}
              </select>
              
              <div className="message-input">
                <input
                  type="text"
                  placeholder="Mesajınızı yazın..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  type="button" 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || !selectedUser}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bildirimler Modal */}
      {showNotifications && (
        <div className="modal-overlay" onClick={() => setShowNotifications(false)}>
          <div className="modal-content notifications-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Bildirimler</h3>
              <button className="close-btn" onClick={() => setShowNotifications(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="notifications-list">
              {notifications.length === 0 ? (
                <div className="no-notifications">Henüz bildiriminiz yok.</div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`notification-item ${notification.status === 'UNREAD' ? 'unread' : ''}`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="notification-header">
                      <strong>{notification.title}</strong>
                      <span className="notification-time">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    <p>{notification.message}</p>
                    <span className={`notification-type ${notification.type.toLowerCase()}`}>
                      {notification.type === 'PROJECT_ASSIGNED' ? 'proje' :
                       notification.type === 'TASK_ASSIGNED' ? 'görev' :
                       notification.type === 'MESSAGE' ? 'mesaj' : 'sistem'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;