import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
    menuComponentsSelected: (index: number) => void;
}
export const Header = ( {menuComponentsSelected}: Props) => {
    const userCtx = useUser();
    const options = ['Tarefas', 'Projetos', 'Calendário', 'Relátorios', 'Configurações'];
    const [optionSelected, setOptionSelected] = useState(0);
    const router = useRouter();
    
    const handleBtnLogout = () => {
        userCtx?.setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
    }

    const handleOptionClick = (option: number) => {
        setOptionSelected(option);
        menuComponentsSelected(option);
    }


    return (
        <header className="bg-dark-gray">
            <div className="flex justify-between p-5 items-center">
                <h1 className="text-yellow-default font-bold text-2xl">Painel de Controle</h1>
                <div className="flex gap-3 items-center">
                    <p className="w-10 h-10 rounded-full bg-yellow-default">
                        <img className="h-full w-full rounded-full" src={`${userCtx?.user?.image_url ? `https://fitnessexclusive.com.br/api/controle-fitness-back/uploads/${userCtx?.user?.image_url}` : 'https://fitnessexclusive.com.br/api/controle-fitness-back/uploads/avatar.jpg'}`} alt="" />
                    </p>
                    <p>Olá, {userCtx?.user?.name} </p>
                    <button onClick={handleBtnLogout} className="cursor-pointer bg-yellow-default text-black font-bold p-2 rounded-md">Sair</button>
                </div>
            </div>
            <nav className="bg-gray-100 text-black/60">
                <ul className="flex gap-4">
                    {options.map((item, index) => (
                        <li 
                            onClick={() => handleOptionClick(index)}
                            key={index}
                            className={`text-xl border-b-4 border-gray-100 p-4 cursor-pointer hover:bg-gray-200 hover:border-gray-200 transition-all duration-100 ease-in-out
                                ${optionSelected === index ? 'border-yellow-default text-yellow-default font-bold': ''}`}
                        >
                            {item}
                        
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}