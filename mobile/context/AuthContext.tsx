import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { User } from "../types";
import { saveAuth, getToken, getStoredUser, clearAuth } from "../lib/auth";
import { authApi, setUnauthorizedHandler } from "../lib/api";
import { registerForPushNotifications } from "../lib/notifications";

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        username: string,
        email: string,
        password: string
    ) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

   
    useEffect(() => {
        const restore = async () => {
            try {
                const [storedToken, storedUser] = await Promise.all([
                    getToken(),
                    getStoredUser(),
                ]);
                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(storedUser);
                }
            } catch {
                
            } finally {
                setIsLoading(false);
            }
        };
        restore();
    }, []);

    const login = async (email: string, password: string) => {
        const res = await authApi.login({ email, password });
        const { token: t, user: u } = res.data.data;
        await saveAuth(t, u);
        setToken(t);
        setUser(u);
        
        try {
            await registerForPushNotifications();
        } catch {
           
        }
    };

    const register = async (
        username: string,
        email: string,
        password: string
    ) => {
        const res = await authApi.register({ username, email, password });
        const { token: t, user: u } = res.data.data;
        await saveAuth(t, u);
        setToken(t);
        setUser(u);
    };

    const logout = async () => {
        await clearAuth();
        setToken(null);
        setUser(null);
    };

    
    useEffect(() => {
        setUnauthorizedHandler(logout);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!token,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
