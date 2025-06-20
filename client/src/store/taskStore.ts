import axios from "axios";
import { create } from "zustand";
import { toastError, toastSuccess } from "../utils/toast";
import { jsPDF } from "jspdf";

type Tasks = {
  id: string;
  title: string;
  description: string | null;
  is_complete: boolean;
  created_at: string;
};

type TasksStore = {
  taskList: Tasks[] | [];
  getTasksAsync: () => Promise<void>;
  addTaskAsync: (title: string, description: string | null) => Promise<boolean>;
  loading: boolean;
  deleteTaskAsync: (id: string) => Promise<void>;
  toggleCompleteAsync: (id: string) => Promise<void>;
  handleDownloadPdf: () => Promise<void>;
};

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const useTasksStore = create<TasksStore>((set) => ({
  taskList: [],
  loading: false,
  getTasksAsync: async () => {
    try {
      set({ loading: true });

      const response = await axios.get(`${SERVER_URL}/tasks`);

      set((state) => ({
        taskList: response.data.data || [],
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
    }
  },
  addTaskAsync: async (title: string, description: string | null) => {
    try {
      if (!title) {
        toastError("Title can't be empty");
        return false;
      }

      const response = await axios.post(`${SERVER_URL}/task`, {
        title,
        description,
      });

      set((state) => ({
        taskList: [...state.taskList, response.data.data],
      }));

      toastSuccess(response.data.message);
      return true;
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "Server error!";

        if (status === 400) {
          toastError(message);
        } else {
          toastError(`Unexpected error (${status})`);
        }
      }

      return false;
    }
  },
  deleteTaskAsync: async (id: string) => {
    try {
      if (!id) return;

      const response = await axios.delete(`${SERVER_URL}/task/${id}`);

      set((state) => ({
        taskList: state.taskList.filter((task) => task.id !== id),
      }));

      toastSuccess(response.data.message);
    } catch (error) {
      toastError("An error occured");
    }
  },
  toggleCompleteAsync: async (id: string) => {
    try {
      const response = await axios.post(`${SERVER_URL}/complete-task/${id}`);

      set((state) => ({
        taskList: state.taskList.map((task) =>
          task.id === id ? { ...task, is_complete: !task.is_complete } : task
        ),
      }));

      toastSuccess(response.data.message);
    } catch (error) {}
  },
  handleDownloadPdf: async () => {
    const getCompletedData = await axios.get(
      `${SERVER_URL}/tasks?status=completed`
    );

    const doc = new jsPDF();
    const now = new Date();
    const timestamp = now.toLocaleString("en-US", {
      timeZone: "Asia/Jakarta", // WIB Timezone
      hour12: true,
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.text("Task Management", 14, 22);
    doc.text(timestamp, pageWidth - 14, 22, { align: "right" });
    doc.setFontSize(12);
    doc.setTextColor(100);

    getCompletedData?.data?.data?.forEach((task: Tasks, index: number) => {
      const baseY = 30 + index * 30;
      const status = "Completed";

      doc.text(`${index + 1}. Title: ${task.title}`, 14, baseY);
      doc.text(`    Description: ${task.description || "-"}`, 14, baseY + 7);
      doc.text(`    Status: ${status}`, 14, baseY + 14);
    });
    doc.save("task-list.pdf");

    console.log(getCompletedData.data.data);
  },
}));
