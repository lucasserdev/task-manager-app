import { TaskType } from "@/types/TaskType";
import axios from "axios";
import { useEffect, useState } from "react";

type Props = {
    closeModalUpdateTask: () => void;
    reloadTasks: () => void;
    taskValue: TaskType | null;
}
export const ModalUpdateTask = ( {closeModalUpdateTask, reloadTasks, taskValue}: Props) => {

    const [title, setTitle] = useState(taskValue?.title);
    const [description, setDescription] = useState(taskValue?.description);
    const [priority, setPriority] = useState(taskValue?.priority);
    const [status, setStatus] = useState(taskValue?.status);
    const [dueDate, setDueDate] = useState(taskValue?.dueDate);

    const [priorityValues, setPriorityValues] = useState([]);
    const [statusValues, setStatusValues] = useState([]);

    const getPriorityAndStatus = async() => {
        const response = await axios.get("https://fitnessexclusive.com.br/api/controle-fitness-back/endpoints/tasks/getValuesPriority.php");
        if(response.data['result']) {
            setStatusValues(response.data['result'].status);
            setPriorityValues(response.data['result'].priority);
        }
    }

    useEffect(() => {
        getPriorityAndStatus();     
    }, []);

    const handleBtnSave = async() => {
        const response = await axios.put("https://fitnessexclusive.com.br/api/controle-fitness-back/endpoints/tasks/updateTask.php", {
            title: title,
            description: description,
            priority: priority,
            status: status,
            dueDate: dueDate,
            id: taskValue?.id
        });

        if(response.data['result']) {
            closeModalUpdateTask();
            reloadTasks();
        } else {
            console.log('deu erro')
        }
    }
    
    return (
        <div className="bg-dark-gray border-2 border-yellow-default p-4 mx-auto max-w-lg rounded-lg text-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 cursor-pointer
        ">
            <div className="flex justify-between">
                <h2 className="text-yellow-default text-2xl">Editar Tarefa</h2>
                <button onClick={closeModalUpdateTask} className="font-bold cursor-pointer">X</button>
            </div>
            {/* form */}
            <div>
                <div className="flex flex-col my-4 gap-1">
                    <label className="text-lg" htmlFor="">Título da Tarefa <span className="text-sm text-yellow-default">*</span></label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        type="text" 
                        className="p-2 border-2 border-white/30 rounded-md bg-black/30 outline-0"
                        placeholder="Digite o título da tarefa"
                    />
                </div>
                <div className="flex flex-col my-4 gap-1">
                    <label className="text-lg" htmlFor="">Descrição</label>
                    <textarea 
                        className="p-2 border-2 border-white/30 rounded-md bg-black/30 outline-0 resize-none h-30"
                        placeholder="Descreva os detalhes da tarefa"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    >

                    </textarea>
                </div>
                <div className="flex gap-3">
                    <div className="flex flex-col my-4 gap-1 flex-1">
                        <label className="text-lg" htmlFor="">Prioridade <span className="text-sm text-yellow-default">*</span></label>
                        <select
                            className="p-2 border-2 border-white/30 rounded-md bg-black/30 outline-0"
                            value={priority}
                            onChange={e => setPriority(e.target.value)}
        
                        >
                            <option value="">Selecione a prioridade</option>
                            {priorityValues.map((priority, index) => (
                                <option key={index} value={`${priority}`}>{priority}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col my-4 gap-1 flex-1">
                        <label className="text-lg" htmlFor="">Status</label>
                        <select
                            className="p-2 border-2 border-white/30 rounded-md bg-black/30 outline-0"
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                        >  
                            <option value="">Selecione um status</option>
                            {statusValues.map((status, index) => (
                                <option key={index} value={`${status}`}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex flex-col my-4 gap-1">
                    <label className="text-lg" htmlFor="">Data de Vencimento</label>
                    <input
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)} 
                        type="date"
                        className="p-2 border-2 border-white/30 rounded-md bg-black/30 outline-0"
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <button onClick={closeModalUpdateTask} className="py-2 px-6 bg-gray-500 rounded-md text-white font-bold cursor-pointer">Cancelar</button>
                    <button onClick={handleBtnSave} className="py-2 px-6 bg-yellow-default rounded-md text-black font-bold cursor-pointer">Salvar</button>
                </div>
            </div>
        </div>
    );
}