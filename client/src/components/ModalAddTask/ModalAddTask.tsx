import React, { useState } from "react";
import Modal from "react-modal";
import { useTasksStore } from "../../store/taskStore";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type Data = {
  title: string;
  description: string;
};

const ModalAddTask: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addTaskAsync } = useTasksStore();
  
  const [data, setData] = useState<Data>({
    title: "",
    description: "",
  });

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      inset: "unset",
      width: "500px",
      height: "auto",
      margin: "auto",
      borderRadius: "12px",
      padding: "24px",
    },
  };

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleAddTask = async () => {
    const isSuccess = await addTaskAsync(data.title, data.description);

    if (isSuccess) {
      setData({ title: "", description: "" });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Add a Task</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-red-500 text-2xl"
        >
          &times;
        </button>
      </div>

      <label htmlFor="" className="">
        <span className="text-sm font-medium text-gray-700 mb-1 inline-block">
          Title
        </span>
        <input
          onChange={(e) => handleChangeInput(e)}
          value={data.title}
          name="title"
          type="text"
          className="w-full cursor-pointer mb-4 text-[12px] py-2 outline-none border-2 bg-transparent pr-[150px] rounded-xl placeholder:text-slate-600   px-4"
        />
      </label>

      <label className="block w-full mb-4">
        <span className="text-sm font-medium text-gray-700 mb-1 inline-block">
          Description
        </span>
        <textarea
          onChange={(e) => handleChangeInput(e)}
          value={data.description}
          rows={8}
          name="description"
          className="w-full resize-none cursor-pointer text-[12px] py-2 outline-none border-2 bg-transparent  rounded-xl placeholder:text-slate-600   px-4 break-words"
        />
      </label>

      <button
        onClick={handleAddTask}
        className="mt-6  w-full px-5 py-2 bg-[#009EED] font-bold text-white rounded-xl hover:bg-[#007fcc] transition-all"
      >
        Add Task
      </button>
    </Modal>
  );
};

export default ModalAddTask;
