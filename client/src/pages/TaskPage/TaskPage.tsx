import { useEffect, useState } from "react";
import ModalAddTask from "../../components/ModalAddTask/ModalAddTask";
import { FiPlus, FiDownload } from "react-icons/fi";
import { useTasksStore } from "../../store/taskStore";
import TaskList from "../../components/TaskList/TaskList";

const TaskPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { taskList, loading, getTasksAsync, handleDownloadPdf } =
    useTasksStore();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    getTasksAsync();
  }, []);

  return (
    <div className="w-full min-h-screen flex justify-center items-center ">
      <div className="w-[1000px] min-h-[500px] max-h-[700px] overflow-hidden  p-[20px] bg-white rounded-[10px]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold text-[24px]">Task Management</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {}}
              className="px-4 py-2 text-sm bg-[#009EED] text-white rounded-2xl hover:bg-[#007fcc] transition"
            >
              <FiDownload onClick={handleDownloadPdf} size={20} />
            </button>
            <button
              onClick={handleOpenModal}
              className="px-4 py-2 text-sm bg-[#009EED] text-white rounded-2xl hover:bg-[#007fcc] transition"
            >
              <FiPlus size={20} />
            </button>
          </div>
        </div>
        <ModalAddTask isOpen={isModalOpen} onClose={handleCloseModal} />
        {loading ? (
          <div className="flex justify-center items-center py-10 text-gray-400 h-[300px]">
            Loading...
          </div>
        ) : taskList.length === 0 ? (
          <div className="flex justify-center items-center h-[300px]">
            No tasks found.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 max-h-[520px]  overflow-auto">
            <TaskList />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskPage;
