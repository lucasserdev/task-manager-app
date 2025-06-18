"use client"
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    const handleSaveBtn = async() => {
        if(confirmPassword === password) {
            console.log('As senhas são iguais');
            if(name && email && password) {
                const response = await axios.post("https://fitnessexclusive.com.br/api/controle-fitness-back/endpoints/createUser.php", {
                    name: name,
                    email: email,
                    password: password
                });

                if(response.data['result']) {
                    console.log(response);
                    router.push("/login");
                } else {
                    alert("Email já existe ou algum campo está com erro");
                }
            } else {
                return alert("Preencha os campos corretamente!");
            }
        } else {
            return alert("As senhas devem ser iguais!");
        }
    }

    return (
        <div className="font-roboto bg-dark-gray h-screen flex justify-center items-center">
        <div className="max-w-lg container bg-gray-300 p-10 rounded-xl flex flex-col gap-5">
                <h2 className="text-gray-700 font-bold text-2xl text-center">Criar Conta</h2>
                <div className="flex flex-col">
                    <label className="text-gray-500 font-bold">Nome Completo</label>
                    <input 
                        className="border outline-0 border-black/30 p-2 rounded-md bg-white text-gray-700"
                        type="text" 
                        placeholder="Seu nome completo"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-gray-500 font-bold">E-mail</label>
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
                        placeholder="Crie uma senha"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-gray-500 font-bold">Confirmar Senha</label>
                    <input 
                        className="border outline-0 border-black/30 p-2 rounded-md bg-white text-gray-700"
                        type="password" 
                        placeholder="Confirme sua senha"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleSaveBtn}
                     className="bg-yellow-default w-full py-2 rounded-md text-black font-bold cursor-pointer">Registrar</button>
                <p className="text-center text-gray-700">Não tem uma conta? <Link href="/login" className="text-blue-400 underline">Entre aqui</Link></p>
        </div>
        </div>
    );
}

export default Page;