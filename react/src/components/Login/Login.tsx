import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../api/user.service';
import './Login.css'

interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

const Login: React.FC = () => {
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [signupUser, setSignupUser] = useState<string>('');
  const [signupEmail, setSignupEmail] = useState<string>('');
  const [signupPassword, setSignupPassword] = useState<string>('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState<string>('');
  const [signupLastName, setSignupLastName] = useState<string>('');

  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [signupMessage, setSignupMessage] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [signupLoading, setSignupLoading] = useState<boolean>(false);

  const [activeForm, setActiveForm] = useState<'login' | 'signup'>('login');

  const navigate = useNavigate();

  const typerElementRef = useRef<HTMLSpanElement>(null);
  const typerOutputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const linesToType = [
      "Initializing Secure Shell v3.1...",
      "Connecting to Access Node Delta-7...",
      "Bypassing primary firewalls...",
      "Authentication required.",
      "Standby for Agent Input...",
      "System Status: Nominal.",
      "Awaiting credentials...",
      "Warning: Unauthorized access attempts are logged.",
      "Protocol Engaged: Shadow Handshake.",
      "Ready for login or registration."
    ];
    let currentLineIndex = 0;
    let currentCharIndex = 0;
    const typingSpeed = 50;
    const delayBetweenLines = 1500;

    const typeLine = () => {
      const typerElement = typerElementRef.current;
      const typerOutput = typerOutputRef.current;

      if (!typerElement || !typerOutput) return;

      if (currentLineIndex >= linesToType.length) {
        currentLineIndex = 0;
      }

      const line = linesToType[currentLineIndex];
      if (currentCharIndex < line.length) {
        typerElement.textContent += line.charAt(currentCharIndex);
        currentCharIndex++;
        typerOutput.scrollTop = typerOutput.scrollHeight;
        setTimeout(typeLine, typingSpeed);
      } else {
        currentCharIndex = 0;
        currentLineIndex++;
        setTimeout(() => {
          typerElement.textContent = "";
          typeLine();
        }, delayBetweenLines);
      }
    };

    typeLine();

    return () => {
    };
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMessage(null);
    setLoginLoading(true);

    try {
      const response: AuthResponse = await userService.login(loginEmail, loginPassword);
      localStorage.setItem('token', response.access_token);

      setLoginMessage('✅ Giriş başarılı! Hoş geldin, ' + (response.user.firstName || response.user.email) + '.');
      console.log('Giriş başarılı!', response.user);

      setTimeout(() => {
        window.location.href = '/';
      }, 1500);

    } catch (err: any) {
      console.error('Login hatası:', err);
      setLoginMessage('❌ ' + (err.message || 'Giriş başarısız. Bilgiler hatalı veya protokol uyuşmazlığı.'));
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupMessage(null);
    setSignupLoading(true);

    if (!signupUser || !signupEmail || !signupPassword || !signupConfirmPassword || !signupLastName) {
      setSignupMessage('❌ Kayıt başarısız: Tüm alanlar zorunludur.');
      setSignupLoading(false);
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupMessage('❌ Kayıt başarısız: Şifreler uyuşmuyor.');
      setSignupLoading(false);
      return;
    }
    if (signupPassword.length < 8) {
      setSignupMessage('❌ Kayıt başarısız: Şifre en az 8 karakter olmalı.');
      setSignupLoading(false);
      return;
    }

    try {
      const response = await userService.register({
        email: signupEmail,
        password: signupPassword,
        firstName: signupUser,
        lastName: signupLastName,
      });

      setSignupMessage('✅ Kayıt başarılı! Lütfen giriş yapın.');
      console.log('Kayıt başarılı!', response.user);

      setTimeout(() => {
        setActiveForm('login');
        setLoginEmail(signupEmail);
        setSignupMessage(null);
      }, 2000);

    } catch (err: any) {
      console.error('Kayıt hatası:', err);
      setSignupMessage('❌ ' + (err.message || 'Kayıt başarısız: Bir hata oluştu.'));
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="login-root-container"> 
      <div id="background-overlay"></div>
      <div className="terminal-window">
        <header className="terminal-header">
          <span className="terminal-title">GİRİŞ YAP</span>
     
        </header>
        <div className="terminal-body">
          <div id="hacker-typer-output" ref={typerOutputRef}>
            <span className="prompt"> </span><span id="typer" ref={typerElementRef}></span><span className="cursor">|</span>
          </div>
          <div className="form-container">
            <div className="form-toggle">
              <button
                id="showLogin"
                className={activeForm === 'login' ? 'active' : ''}
                onClick={() => setActiveForm('login')}
              >
                Giriş Yap
              </button>
              <button
                id="showSignup"
                className={activeForm === 'signup' ? 'active' : ''}
                onClick={() => setActiveForm('signup')}
              >
                Üye Ol
              </button>
            </div>

            <form className={`login-form${activeForm === 'login' ? ' active-form' : ''}`} onSubmit={handleLoginSubmit}>
              <h2>Giriş Yap</h2>
              <div className="input-group">
                <label htmlFor="loginEmail">E-posta</label>
                <input
                  type="email"
                  id="loginEmail"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="loginPassword">Şifre</label>
                <input
                  type="password"
                  id="loginPassword"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" disabled={loginLoading}>{loginLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}</button>
              {loginMessage && <div className="message">{loginMessage}</div>}
            </form>

            <form className={`register-form${activeForm === 'signup' ? ' active-form' : ''}`} onSubmit={handleRegisterSubmit}>
              <h2>Üye Ol</h2>
              <div className="input-group">
                <label htmlFor="signupUser">İsim</label>
                <input
                  type="text"
                  id="signupUser"
                  value={signupUser}
                  onChange={(e) => setSignupUser(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="signupLastName">Soyisim</label>
                <input
                  type="text"
                  id="signupLastName"
                  value={signupLastName}
                  onChange={(e) => setSignupLastName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="signupEmail">E-posta</label>
                <input
                  type="email"
                  id="signupEmail"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="signupPassword">Şifre</label>
                <input
                  type="password"
                  id="signupPassword"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="signupConfirmPassword">Şifre (Tekrar)</label>
                <input
                  type="password"
                  id="signupConfirmPassword"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" disabled={signupLoading}>{signupLoading ? 'Kayıt Olunuyor...' : 'Üye Ol'}</button>
              {signupMessage && <div className="message">{signupMessage}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
