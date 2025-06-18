import { useEffect, useState } from "react";
import { ModalCreateTask } from "./ModalCreateTask";
import { TaskType } from "@/types/TaskType";
import axios from "axios";
import { useUser } from "@/contexts/UserContext";
import { ModalUpdateTask } from "./ModalUpdateTask";
import { CommentType } from "@/types/CommentType";

export const Task = () => {
    const statusValue = ['Total de Tarefas', 'Concluídas', 'Pendentes', 'Atrasadas'];
    const [openCreateTask, setOpenCreateTask] = useState(false);
    const [openUpdateTask, setOpenUpdateTask] = useState(false);
    const [tasks, setTasks] = useState<TaskType[] | null>(null);
    const [taskUpdate, setTaskUpdate] = useState<TaskType | null>(null);
    const userCtx = useUser();
    const userId = userCtx?.user?.id;
    const today = new Date();
    const newToday = today.toLocaleDateString('pt-BR');

    const [showComments, setShowComments] = useState(false);
    const [idTask, setIdTask] = useState<number | null>(null);
    const [comments, setComments] = useState<CommentType[] | null>(null);
    const [inputComment, setInputComment] = useState('');
    

    const totalTask = tasks?.length || 0;
    const totalCompleted = tasks?.filter(item => item.status === 'concluida').length;
    const totalPending = tasks?.filter(item => item.status === 'pendente').length;
    const totalLate = tasks?.filter(item => {
        const today = new Date();
        const due = new Date(item.dueDate);
        return item.status !== 'concluida' && due < today;
    }).length;

    const counts = [totalTask, totalCompleted, totalPending, totalLate];

    const infoTasks = statusValue.map((item, index) => ({
        id: index + 1,
        label: item,
        value: counts[index]
    }));


    const getAllTask = async(userId: number) => {
        const response = await axios.get(`https://fitnessexclusive.com.br/api/controle-fitness-back/endpoints/tasks/getAllTask.php?userId=${userId}`);

        if(response.data['result']) {
            setTasks(response.data['result']);
        }
    }

    const delTask = async (id: number) => {
        const response = await axios.delete("https://fitnessexclusive.com.br/api/controle-fitness-back/endpoints/tasks/delTask.php", {
            data: { id }
        });

        if(response.data['result']) {
            
            getAllTask(Number(userId));
        } else {
            console.log('deu erro')
        }
    }

    const completedTask = async(id:number) => {
        const response = await axios.put("https://fitnessexclusive.com.br/api/controle-fitness-back/endpoints/tasks/completedTask.php", {
            id: id
        });

        if(response.data['result']) {
             getAllTask(Number(userId));
        } else {
             console.log("Erro", response.data['error']);
        }
 }

    const brazilianFormat = (date: string) => {
        const newDate = date;
        const soData = new Date(newDate).toLocaleDateString('pt-BR');
        return soData;
    }

    useEffect(() => {
        if(userId) {
            getAllTask(userId);
        }
    }, [userId]);

    const handleBtnCreateTask = () => {
        setOpenCreateTask(true);
    }

    const handleBtnCloseCreatetask = () => {
        setOpenCreateTask(false);
    }

    const handleBtnUpdateTask = async(id: number) => {
        
        const response = await axios.get("https://fitnessexclusive.com.br/api/controle-fitness-back/endpoints/tasks/getTask.php", {
            params: {id: id}
        });

        if(response.data['result']) {
            setTaskUpdate(response.data['result']);
            setOpenUpdateTask(true);
        } else {
            console.log('n deu');
        }
    }

    const handleBtnCloseUpdateTask = () => {
        setOpenUpdateTask(false);
    }

    const getComments = async(id: number) => {
        const response = await axios.get("https://fitnessexclusive.com.br/api/controle-fitness-back/endpoints/tasks/getComments.php", {
            params: {id: id}
        });

        if(response.data['result']) {
            setComments(response.data['result']);
        }
    }

    const handleBtnOpenComments = async(id: number) => {
        
        console.log(id)
        if(showComments && idTask === id) {
            setShowComments(false);
        } else {
            setIdTask(id);
            setShowComments(true);
            getComments(id);
        }
    }

    const handleBtnAddComment = async(id: number) => {
        if(inputComment) {
            const response = await axios.post("https://fitnessexclusive.com.br/api/controle-fitness-back/endpoints/tasks/addComment.php", {
                'task_id': id,
                'label': inputComment
            });
    
            if(response.data['result']) {
                getComments(id);
                setInputComment('');
            }
        } else {
            alert("Preencha o comentario!")
        }
    }

    return (
        <div className={`p-5 ${openCreateTask === true ? 'cursor-not-allowed bg-black/60' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
                {infoTasks.map((item) => (
                    <div key={item.id} className="bg-dark-gray rounded-xl border-2 border-yellow-default py-5 flex flex-col items-center gap-2">
                        <span className="text-4xl font-bold text-yellow-default">{item.value}</span>
                        <p className="text-white">{item.label}</p>
                    </div>
                ))}
            </div>
            <div className="flex justify-between my-5">
                <h2 className="text-2xl font-bold text-black/80">Lista de Tarefas</h2>
                <button 
                    onClick={handleBtnCreateTask}
                    className="bg-yellow-default py-1 px-4 rounded-md font-bold cursor-pointer"
                >+ Nova Tarefa
                </button>
            </div>
            {openCreateTask &&
                <ModalCreateTask closeModalCreateTask={handleBtnCloseCreatetask} reloadTasks={() => getAllTask(Number(userId))}/>
            }
            {openUpdateTask && 
                <ModalUpdateTask taskValue={taskUpdate} closeModalUpdateTask={handleBtnCloseUpdateTask} reloadTasks={() => getAllTask(Number(userId))} />
            }
            {!tasks &&
                <p>Adicione sua primeira tarefa</p>
            }
            {tasks &&
                <ul className="space-y-3">
                    {tasks.map(item => (
                        <li
                            key={item.id}
                            className={`border border-gray-300 rounded-lg p-4 ${item.status === 'concluida' ? 'bg-green-100' : 'bg-gray-200'} ${newToday >= brazilianFormat(item.dueDate) && item.status !== 'concluida' ? 'bg-red-300': ''}`}
                        >
                            <div className="flex justify-between">
                                <h2 className={`${item.status === 'concluida' ? 'line-through' : ''} text-xl font-bold text-black/70`}>{item.title}</h2>
                                <div className="flex gap-2 text-sm">
                                    <button 
                                        onClick={() => completedTask(item.id)}
                                        className={`px-2 rounded-md ${item.status === 'concluida' ? 'bg-gray-400 border border-gray-400 text-white cursor-not-allowed' : 'bg-yellow-default text-black border border-yellow-default font-bold hover:bg-yellow-default/70 cursor-pointer'}`}
                                    >
                                        {item.status === 'concluida' ? '✓ Concluída' : '✓ Concluir'}  
                                    </button>
                                    <button
                                        onClick={() => handleBtnUpdateTask(item.id)}
                                        className="bg-yellow-default font-bold px-2 rounded-md cursor-pointer hover:bg-yellow-default/70 border border-yellow-default"
                                    >
                                        ✏️ Editar
                                    </button>
                                    <button
                                        onClick={() => delTask(item.id)}
                                        className="bg-red-500 text-white px-2 rounded-md cursor-pointer hover:bg-red-500/60 border border-red-400"
                                    >
                                        🗑️ Excluir
                                    </button>
                                    <button
                                        onClick={() => handleBtnOpenComments(item.id)}
                                        className="bg-black text-white px-2 rounded-md cursor-pointer hover:bg border border-black"
                                    >
                                        💬 Comentários
                                    
                                    </button>
                                </div>
                            </div>
                            <p className="text-lg text-black/50 my-2">{item.description}</p>
                            <div className="flex justify-between text-sm text-black/50">
                                <p>Criado em: {brazilianFormat(item.created_at)}</p>
                                {item.status === 'concluida' ? <p>Concluído: {brazilianFormat(item.completed_at)}</p> : <p>Prioridade: {item.priority}</p> }
                                {item.status === 'concluida' ? <p>Prioridade: {item.priority}</p> : <p>Status: {item.status}</p>}
                            </div>
                            {item.status !== 'concluida' &&
                                <p className="text-black/50 text-sm">Vencimento em {brazilianFormat(item.dueDate)}</p>
                            }
                            {newToday >= brazilianFormat(item.dueDate) &&
                                <div>
                                    <p className="text-red-500 font-bold">{newToday === brazilianFormat(item.dueDate) && item.status !== 'concluida' && 'VENCIMENTO HOJE'}</p>
                                    <p className="text-red-500 font-bold">{newToday > brazilianFormat(item.dueDate) && item.status !== 'concluida' && 'JÁ VENCEU'}</p>
                                </div>
                            }

                            {showComments && idTask === item.id &&
                                <div className="border-t border-black/30">
                                    <ul className="my-2 space-y-2">
                                        {comments?.map(item => (
                                            <li 
                                                key={item.id}
                                                className="border-l-4 border-yellow-default p-2 bg-white rounded-md">
                                                <p>{brazilianFormat(item.created_at)}</p>
                                                <p>{item.label}</p>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex gap-2">
                                        <input 
                                            value={inputComment}
                                            onChange={e => setInputComment(e.target.value)}
                                            className="bg-white border border-black/30 rounded-md px-3 py-1 outline-0 flex-1"
                                            type="text" 
                                            placeholder="Adicionar comentário...."
                                        />
                                        <button
                                            onClick={() => handleBtnAddComment(item.id)}
                                            className="bg-black text-white rounded-md px-2 cursor-pointer hover:bg-black/80"
                                        >Enviar
                                        
                                        </button>
                                    </div>
                                </div>
                            }
                        </li>
                    ))}
                </ul>
            }

        </div>
    );
}