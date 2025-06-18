'use client'
import { useUser } from "@/contexts/UserContext";
import { UserType } from "@/types/UserType";
import axios from "axios";
import { useEffect, useRef, useState } from "react";


export const Settings = () => {
    const userCtx = useUser();
    const [userUpdate, setUserUpdate] = useState<UserType | null>(null);
    const id = userCtx?.user?.id;
    const fileUnput = useRef<HTMLInputElement>(null);
    

    const [inputName, setInputName] = useState('');
    const [inputEmail, setInputEmail] = useState('');

    const getUser = async() => {
        const response = await axios.get("https://fitnessexclusive.com.br/api/controle-fitness-back/endpoints/getuser.php", {
            params: { id: id}
        });

        if(response.data['result']) {
            setUserUpdate(response.data['result']);
        } else {
            console.log('deu erro')
        }
    }

    useEffect(() => {
        if(id) {
            getUser();
        }
    },[]);

    useEffect(() => {
        if(userUpdate) {
            setInputName(userUpdate.name);
            setInputEmail(userUpdate.email);
        }
    }, [userUpdate]);

    const addPhoto = async(id: any) => {
        const formData = new FormData();
        if(fileUnput.current?.files && fileUnput.current.files.length > 0) {
            const file = fileUnput.current?.files[0];
            formData.append('id', id);
            formData.append('file', file);

            const response = await axios.post("https://fitnessexclusive.com.br/api/controle-fitness-back/endpoints/addPhoto.php",
                formData, {
                    headers: {
                        'Content-Type' : 'multipart/form-data'
                    }
                }
            );

            if(response.data['result']) {
                console.log(response.data['result'])
                getUser();
                userCtx?.setUser(response.data['result']);
            } else {
                console.log('deu erro na api');
            }
        } else {
            console.log('Não existe imagem');
        }
    }

    const removePhoto = async(id: any) => {
        const response = await axios.post("https://fitnessexclusive.com.br/api/controle-fitness-back/endpoints/removePhoto.php", {
            id: id
        });

        if(response.data['result']) {
            console.log(response);
            getUser();
            userCtx?.setUser(response.data['result'])
        } else {
            console.log('api deu erro')
        }
    }

    const handleUpdateUser = async() => {
        const response = await axios.put("https://fitnessexclusive.com.br/api/controle-fitness-back/endpoints/updateUser.php", {
            id: id,
            name: inputName,
            email: inputEmail
        });

        if(response.data['result']) {
            console.log(response)
            getUser();
            userCtx?.setUser(response.data['result']);
        }
    }

    return (
        <div className="p-10 space-y-3">
            <h2 className="text-2xl text-black/60 font-bold text-center">Configurações</h2>
            <div className="bg-gray-200 border border-gray-300 rounded-lg p-5">
                <p className="text-xl">👤 Perfil do Usuário </p>
                <div className="flex gap-3 mt-5 items-center">
                    <div className="w-20 h-20 bg-yellow-default rounded-full">
                        <img 
                            src={`${userUpdate?.image_url ? `https://fitnessexclusive.com.br/api/controle-fitness-back/uploads/${userUpdate?.image_url}` : 'https://fitnessexclusive.com.br/api/controle-fitness-back/uploads/avatar.jpg'}`} 
                            alt="foto-perfil" 
                            className="h-full w-full rounded-full"
                        />
                            
                    </div>
                    <div className="flex flex-col gap-2">
                        <label 
                            htmlFor="fileUpload" className="bg-yellow-default py-2 px-8 font-bold cursor-pointer rounded-md">📷 Alterar Foto</label>
                        <input 
                            ref={fileUnput}
                            accept="image/*"
                            className="hidden" 
                            type="file"  
                            id="fileUpload" 
                            onChange={() => addPhoto(id)}
                        />
                        <button
                            onClick={() => removePhoto(id)}
                            className="bg-black text-white py-2 px-8 cursor-pointer rounded-md">🗑️ Remover Foto</button>
                    </div>
                </div>
            </div>

            <div className="bg-gray-200 border border-gray-300 rounded-lg p-5">
                <p className="text-xl">⚙️ Configurações Gerais</p>
                <div className="flex flex-col my-2">
                    <label className="text-black/50 font-bold text-lg">Nome Completo</label>
                    <input 
                        value={inputName}
                        onChange={e => setInputName(e.target.value)}
                        className="bg-white border border-gray-300 rounded-md p-2 outline-0"
                        type="text" 
                    />
                </div>
                <div className="flex flex-col my-2">
                    <label className="text-black/50 font-bold text-lg">E-mail</label>
                    <input 
                        value={inputEmail}
                        onChange={e => setInputEmail(e.target.value)}
                        className="bg-white border border-gray-300 rounded-md p-2 outline-0"
                        type="text" 
                    />
                </div>

                <div className="flex justify-center">
                    <button 
                        onClick={handleUpdateUser}
                        className="bg-yellow-default py-2 px-10 rounded-md font-bold text-lg mt-3 cursor-pointer"
                    >💾 Salvar Alterações
                    </button>
                </div>
            </div>

            <div className="bg-gray-200 border border-gray-300 rounded-lg p-5">
                <p className="text-xl">🔒 Segurança</p>
                <div className="flex flex-col my-2">
                    <label className="text-black/50 font-bold text-lg">Senha atual</label>
                    <input 
                        className="bg-white border border-gray-300 rounded-md p-2 outline-0"
                        type="text" 
                        placeholder="Sua senha atual"
                    />
                </div>
                <div className="flex flex-col my-2">
                    <label className="text-black/50 font-bold text-lg">Nova Senha</label>
                    <input 
                        className="bg-white border border-gray-300 rounded-md p-2 outline-0"
                        type="text" 
                        placeholder="Nova senha"
                    />
                </div>
                <div className="flex flex-col my-2">
                    <label className="text-black/50 font-bold text-lg">Confirmar Nova Senha</label>
                    <input 
                        className="bg-white border border-gray-300 rounded-md p-2 outline-0"
                        type="text" 
                        placeholder="Confirme a nova senha"
                    />
                </div>

                <div className="flex justify-center">
                    <button className="bg-yellow-default py-2 px-10 rounded-md font-bold text-lg mt-3">🔐 Alterar Senha</button>
                </div>
            </div>
        </div>
    );
}