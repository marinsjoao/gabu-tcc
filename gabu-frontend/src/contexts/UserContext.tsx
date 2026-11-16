import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { User } from "../types";
import { useSQLiteContext } from "expo-sqlite";
import { getUser } from "../database/repositories/userRepository";

type UserContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
  const db = useSQLiteContext();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
        setLoading(true);
        
        async () => {
        let active = true;

        try {
            const loadedUser = await getUser(db);
            if (active) {
            setUser(loadedUser);
            setError(null);
            }
        } catch {
            if (active) setError('Não foi possível carregar seu progresso local.');
        }
        };

    } catch (error) {
        console.error('Erro ao carregar usuário:', error);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Hook para acessar o contexto
export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      'useUser deve ser utilizado dentro de UserProvider'
    );
  }

  return context;
}