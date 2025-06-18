'use client'
import { UserType } from "@/types/UserType";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type UserContextType = {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
}
export const UserContext = createContext<UserContextType | null>(null);

type Props = {
    children: ReactNode;
}
export const UserProvider = ( { children }: Props ) => {
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        const dataUser = localStorage.getItem('user');
        if(dataUser) {
            setUser(JSON.parse(dataUser));
        }
    }, []);

    return (
        <UserContext.Provider value={ {user, setUser} }>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
