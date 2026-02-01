import { 
  FiUser, 
  FiShield, 
  FiUsers, 
  FiImage, 
  FiMonitor, 
  FiServer, 
  FiCode, 
  FiCheckSquare, 
  FiCloud, 
  FiBarChart, 
  FiTarget 
} from 'react-icons/fi';

export interface RoleInfo {
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

export const ROLE_MAPPINGS: Record<string, RoleInfo> = {
  ADMIN: {
    label: 'Yönetici',
    icon: FiShield,
    color: '#e74c3c',
    description: 'Sistem yöneticisi, tüm yetkilere sahip'
  },
  USER: {
    label: 'Kullanıcı',
    icon: FiUser,
    color: '#95a5a6',
    description: 'Temel kullanıcı yetkileri'
  },
  PROJECT_MANAGER: {
    label: 'Proje Yöneticisi',
    icon: FiUsers,
    color: '#3498db',
    description: 'Proje planlama ve yönetimi'
  },
  UI_UX_DESIGNER: {
    label: 'UI/UX Tasarımcı',
    icon: FiImage,
    color: '#9b59b6',
    description: 'Kullanıcı arayüzü ve deneyimi tasarımı'
  },
  FRONTEND_DEVELOPER: {
    label: 'Frontend Geliştirici',
    icon: FiMonitor,
    color: '#2ecc71',
    description: 'Kullanıcı arayüzü geliştirme'
  },
  BACKEND_DEVELOPER: {
    label: 'Backend Geliştirici',
    icon: FiServer,
    color: '#f39c12',
    description: 'Sunucu tarafı geliştirme'
  },
  FULL_STACK_DEVELOPER: {
    label: 'Full Stack Geliştirici',
    icon: FiCode,
    color: '#1abc9c',
    description: 'Hem frontend hem backend geliştirme'
  },
  QA_TESTER: {
    label: 'QA Test Uzmanı',
    icon: FiCheckSquare,
    color: '#e67e22',
    description: 'Kalite kontrol ve test süreçleri'
  },
  DEVOPS_ENGINEER: {
    label: 'DevOps Mühendisi',
    icon: FiCloud,
    color: '#34495e',
    description: 'Geliştirme ve operasyon süreçleri'
  },
  DATA_ANALYST: {
    label: 'Veri Analisti',
    icon: FiBarChart,
    color: '#8e44ad',
    description: 'Veri analizi ve raporlama'
  },
  PRODUCT_MANAGER: {
    label: 'Ürün Yöneticisi',
    icon: FiTarget,
    color: '#16a085',
    description: 'Ürün stratejisi ve roadmap yönetimi'
  }
};

export const getRoleInfo = (role: string): RoleInfo => {
  return ROLE_MAPPINGS[role] || ROLE_MAPPINGS.USER;
};

export const getRoleColor = (role: string): string => {
  return getRoleInfo(role).color;
};

export const getRoleLabel = (role: string): string => {
  return getRoleInfo(role).label;
};

export const getRoleIcon = (role: string) => {
  return getRoleInfo(role).icon;
}; 