import * as SecureStore from "expo-secure-store";
import { User } from "../types";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const saveAuth = async (token: string, user: User) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
};

export const getToken = async (): Promise<string | null> => {
    return SecureStore.getItemAsync(TOKEN_KEY);
};

export const getStoredUser = async (): Promise<User | null> => {
    const raw = await SecureStore.getItemAsync(USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as User;
    } catch {
        return null;
    }
};

export const clearAuth = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
};
