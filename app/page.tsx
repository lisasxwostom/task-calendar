"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { addDays, format, startOfWeek } from "date-fns";

const initialTasks = [
  { id: 1, text: "Полить цветы", color: "bg-green-300" },
  { id: 2, text: "Купить землю", color: "bg-yellow-300" },
  { id: 3, text: "Посадить мускари", color: "bg-blue-300" },
];

const generateWeek = () => {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);
  const [weekTasks, setWeekTasks] = useState<Record<string, typeof initialTasks>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [weekView, setWeekView] = useState(true);

  const handleDrop = (date: string, task: any) => {
    setWeekTasks((prev) => ({
      ...prev,
      [date]: [...(prev[date] || []), task],
    }));
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  };

  const handleEdit = (id: number, newText: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
    setEditId(null);
  };

  const renderTasks = (list: typeof initialTasks, editable = false) =>
    list.map((task) =>
      editId === task.id ? (
        <input
          key={task.id}
          className="p-1 m-1 border rounded w-full"
          defaultValue={task.text}
          autoFocus
          onBlur={(e) => handleEdit(task.id, e.target.value)}
        />
      ) : (
        <motion.div
          key={task.id}
          drag
          onDoubleClick={() => editable && setEditId(task.id)}
          className={`p-2 m-1 text-sm rounded shadow cursor-grab ${task.color}`}
        >
          {task.text}
        </motion.div>
      )
    );

  const days = generateWeek();

  return (
    <main className="flex min-h-screen flex-col md:flex-row p-4 gap-4">
      <div className="w-full md:w-1/3 p-2 border rounded shadow">
        <h2 className="text-xl font-bold mb-2">Задачи</h2>
        {renderTasks(tasks, true)}
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">
            Календарь ({weekView ? "Неделя" : "Месяц"})
          </h2>
          <button
            onClick={() => setWeekView(!weekView)}
            className="px-2 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
          >
            Переключить
          </button>
        </div>

        {weekView ? (
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd");
              return (
                <div
                  key={dateStr}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const id = Number(e.dataTransfer.getData("text"));
                    const task = tasks.find((t) => t.id === id);
                    if (task) handleDrop(dateStr, task);
                  }}
                  className="min-h-[100px] p-2 border rounded shadow bg-gray-50"
                >
                  <div className="text-sm font-bold">{format(day, "EEE dd.MM")}</div>
                  <div>{renderTasks(weekTasks[dateStr] || [])}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1 text-sm">
            {Array.from({ length: 35 }, (_, i) => (
              <div
                key={i}
                className="min-h-[60px] border rounded p-1 text-center bg-gray-50"
              >
                {i + 1}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
