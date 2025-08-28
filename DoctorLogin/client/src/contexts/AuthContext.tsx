import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types
interface User {
  sub: string;
  email: string;
  name: string;
  roles: string[];
  role: string;
  permissions: string[];
  loginTime: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

interface AuthContextType {
  state: AuthState;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Action types
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' };

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
        error: null,
      };
    case 'SET_USER':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
        error: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    default:
      return state;
  }
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Validate and decode token
  const validateToken = (token: string): User => {
    try {
      console.log('🔍 Validating token:', token.substring(0, 20) + '...');
      
      // Decode base64 token
      const decoded = JSON.parse(atob(token));
      console.log('✅ Token decoded successfully:', decoded);

      // Validate required fields
      const requiredFields = ['sub', 'email', 'name', 'roles'];
      for (const field of requiredFields) {
        if (!decoded[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Validate roles array
      if (!Array.isArray(decoded.roles) || decoded.roles.length === 0) {
        throw new Error('Roles must be a non-empty array');
      }

      // Validate permissions array
      if (!decoded.permissions || !Array.isArray(decoded.permissions)) {
        throw new Error('Permissions must be an array');
      }

      // Add role as string for backwards compatibility
      const user: User = {
        ...decoded,
        role: decoded.roles[0], // Primary role
        loginTime: decoded.loginTime || new Date().toISOString(),
      };

      console.log('✅ User validated successfully:', user.name, user.role);
      return user;
    } catch (error) {
      console.error('❌ Token validation failed:', error);
      throw new Error(`Invalid authentication token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Login function
  const login = async (token: string): Promise<void> => {
    console.log('🔐 Starting login process...');
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Add artificial delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));

      // Validate token and extract user
      const user = validateToken(token);

      // Store in localStorage
      localStorage.setItem('health_companion_token', token);
      localStorage.setItem('health_companion_user', JSON.stringify(user));

      // Update state
      dispatch({ type: 'SET_USER', payload: user });
      
      console.log('✅ Login successful for:', user.name);
    } catch (error) {
      console.error('❌ Login failed:', error);
      
      // Clear any stored data
      localStorage.removeItem('health_companion_token');
      localStorage.removeItem('health_companion_user');
      
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
      throw error; // Re-throw for component handling
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    console.log('🚪 Logging out...');
    
    // Clear storage
    localStorage.removeItem('health_companion_token');
    localStorage.removeItem('health_companion_user');
    
    // Update state
    dispatch({ type: 'LOGOUT' });
    
    console.log('✅ Logout complete');
  };

  // Check for existing authentication on mount
  useEffect(() => {
    const checkExistingAuth = async () => {
      console.log('🔍 Checking for existing authentication...');
      
      try {
        const token = localStorage.getItem('health_companion_token');
        const userStr = localStorage.getItem('health_companion_user');

        if (token && userStr) {
          console.log('📦 Found stored authentication data');
          
          // Validate stored user data
          const storedUser = JSON.parse(userStr);
          
          // Re-validate the token to ensure it's still valid
          const validatedUser = validateToken(token);
          
          // Update state with validated user
          dispatch({ type: 'SET_USER', payload: validatedUser });
          
          console.log('✅ Authentication restored for:', validatedUser.name);
        } else {
          console.log('ℹ️ No existing authentication found');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('❌ Failed to restore authentication:', error);
        
        // Clear corrupted data
        localStorage.removeItem('health_companion_token');
        localStorage.removeItem('health_companion_user');
        
        dispatch({ type: 'SET_ERROR', payload: 'Failed to restore previous session' });
      }
    };

    checkExistingAuth();
  }, []);

  const contextValue: AuthContextType = {
    state,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook to check if user is authenticated
export function useIsAuthenticated(): boolean {
  const { state } = useAuth();
  return state.isAuthenticated;
}

// Hook to get current user
export function useUser(): User | null {
  const { state } = useAuth();
  return state.user;
}

// Hook to check if user has specific permission
export function useHasPermission(permission: string): boolean {
  const { state } = useAuth();
  return state.user?.permissions?.includes(permission) ?? false;
}
