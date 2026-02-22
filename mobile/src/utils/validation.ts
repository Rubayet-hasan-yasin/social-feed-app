

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}


export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true };
};


export const validatePassword = (password: string): ValidationResult => {
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }
  return { isValid: true };
};


export const validateUsername = (username: string): ValidationResult => {
  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters' };
  }
  return { isValid: true };
};
