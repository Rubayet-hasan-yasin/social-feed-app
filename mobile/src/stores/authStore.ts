

import { create } from 'zustand';
import { login as apiLogin, register as apiRegister } from '../services/auth';
import {
    deleteToken,
    deleteUser,
    getToken,
    getUser,
    saveToken,
    saveUser,
} from '../services/storage';
import { User } from '../types/models';


interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}


export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

 
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      
      const response = await apiLogin(email, password);

      await saveToken(response.token);
      await saveUser(response.user);

      
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

 
  register: async (username: string, email: string, password: string) => {
    set({ isLoading: true });
    try {
  
      const response = await apiRegister(username, email, password);

    
      await saveToken(response.token);
      await saveUser(response.user);

      
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

 
  logout: async () => {
    try {
      
      await deleteToken();
      await deleteUser();

     
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },


  restoreSession: async () => {
    set({ isLoading: true });
    try {
      
      const token = await getToken();
      const user = await getUser();

      if (token && user) {
       
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
       
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Session restoration error:', error);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

 
  setUser: (user: User | null) => {
    set({ user });
  },

  
  setToken: (token: string | null) => {
    set({ token });
  },
}));
