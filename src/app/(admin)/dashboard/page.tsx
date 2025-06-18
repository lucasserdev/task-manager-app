"use client"
import { Calendar } from "@/components/Calendar";
import { Header } from "@/components/Header";
import { Project } from "@/components/Project";
import { Report } from "@/components/Report";
import { Settings } from "@/components/Settings";
import { Task } from "@/components/Task";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

const Page = () => {
  const userCtx = useUser();
  const router = useRouter();
  const [menuSelected, setMenuSelected] = useState<number>(0);
  const menuComponents = [<Task />, <Project />, <Calendar />, <Report />, <Settings />];

  const menuComponentsSelected = (index: number) => {
    setMenuSelected(index);
  }

  useEffect(() => {
    const dataUser = localStorage.getItem('user');
    if(dataUser) {
      userCtx?.setUser(JSON.parse(dataUser));
    } else {
      router.push('/login');
    }
  }, []);

  return (
    <UserProvider>
      <div className="font-roboto bg-dark-gray py-10">
        <div className="bg-white shadow shadow-yellow-default/50 container mx-auto">
          <Header menuComponentsSelected={menuComponentsSelected}/>
          
          <div 
            className="text-black">
              {menuComponents[menuSelected]}
          </div>
        </div>
        
      </div>
    </UserProvider>
  );
}

export default Page;