export interface Event {
  _id: string;
  name: string;
  date: string;
  coverImage?: string;
}

export interface State {
  _id: string;
  name: string;
  eventId: string;
}

export interface Photo {
  [x: string]: string | undefined;
  _id: string;
  imageUrl: string;
  uploadedAt: string;
  eventId: string;
  state: string;
}

export interface Admin {
  _id: string;
  username: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
} 