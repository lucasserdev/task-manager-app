"use client"
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleBtnLogin = async() => {
        if(email && password) {
            const response = await axios.post("https://fitnessexclusive.com.br/api/controle-fitness-back/endpoints/login.php", {
                email: email,
                password: password
            });

            if(response.data['result']) {
                console.log(response)
                localStorage.setItem('token', response.data['token']);
                localStorage.setItem('user', JSON.stringify(response.data['result']));
                router.push("/dashboard");
            }
        } else {
            alert("Credenciais erradas!");
        }
    }

    return (
        <div className="font-roboto bg-dark-gray h-screen flex justify-center items-center">
        <div className="max-w-lg container bg-gray-300 p-10 rounded-xl flex flex-col gap-5">
                <h2 className="text-gray-700 font-bold text-2xl text-center">Entrar no Sistema</h2>
                <div className="flex flex-col">
                    <label className="text-gray-500 font-bold">E-Mail</label>
                    <input 
                        className="border outline-0 border-black/30 p-2 rounded-md bg-white text-gray-700"
                        type="text" 
                        placeholder="seu@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-gray-500 font-bold">Senha</label>
                    <input 
                        className="border outline-0 border-black/30 p-2 rounded-md bg-white text-gray-700"
                        type="password" 
                        placeholder="Sua senha"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <button 
                    onClick={handleBtnLogin}
                    className="bg-yellow-default w-full py-2 rounded-md text-black font-bold cursor-pointer">Entrar
                
                </button>
                <p className="text-center text-gray-700">Não tem uma conta? <Link href="/register" className="text-blue-400 underline">Registre-se</Link></p>
        </div>
        </div>
    );
}

export default Page;