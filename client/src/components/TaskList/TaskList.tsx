import React from "react";
import { useTasksStore } from "../../store/taskStore";
import { MdDelete } from "react-icons/md";
const TaskList = () => {
  const { taskList, deleteTaskAsync, toggleCompleteAsync } = useTasksStore();
  console.log(taskList);

  return (
    <>
      {taskList?.map((data, index) => {
        console.log(data.is_complete);

        return (
          <div
            key={index}
            className="flex justify-between items-center gap-3 my-[20px]"
          >
            <div
              key={data.id}
              className="bg-white shadow rounded-xl p-4 mb-4 w-full"
            >
              <div className="flex items-start gap-3">
                <div>
                  <h3 className={`font-semibold text-lg`}>
                    {data.title}
                    {data.is_complete ? (
                      <span className="text-blue-700 ml-6">COMPLETED</span>
                    ) : (
                      ""
                    )}
                  </h3>
                  {data.description && (
                    <p className="text-sm text-gray-500 mt-1 break-words">
                      {data.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end items-center gap-4 mt-4 p-3 bg-white rounded-md">
                <MdDelete
                  onClick={() => deleteTaskAsync(data.id)}
                  className="cursor-pointer text-red-500 hover:scale-125 transition-transform"
                />
                <button
                  onClick={() => toggleCompleteAsync(data.id)}
                  className="text-sm px-3 py-1 bg-slate-100 text-gray-600 hover:text-[#009EED] rounded-md transition"
                >
                  {data.is_complete ? "Mark as Incomplete" : "Mark as Complete"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default TaskList;
