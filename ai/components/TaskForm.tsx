'use client';

import { useState } from 'react';
import { Loader2, ListTodo, Clock, Flame, Link2 } from 'lucide-react';

interface Subtask {
  name: string;
  time_estimate: string;
  difficulty: number;
  depends_on: string[];
}

export default function TaskForm() {
  const [task, setTask] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubtasks(null);

    const response = await fetch('http://localhost:8000/breakdown', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task }),
    });

    const data = await response.json();
    setSubtasks(data.subtasks);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-800 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-700 flex items-center justify-center gap-2">
          <ListTodo className="h-7 w-7 text-blue-500" />
          AI Task Breakdown
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="e.g. Build an AI-assisted To-Do App"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin h-5 w-5" />}
            {loading ? 'Generating...' : 'Generate Subtasks'}
          </button>
        </form>

        {subtasks && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Subtasks:</h2>
            {subtasks.map((subtask, index) => (
              <div
                key={index}
                className="bg-blue-50 border border-blue-100 p-4 rounded-xl shadow-sm space-y-2"
              >
                <p className="text-lg font-medium text-blue-800">{subtask.name}</p>
                <div className="text-sm text-blue-700 space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time Estimate: {subtask.time_estimate}
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4" />
                    Difficulty: {subtask.difficulty}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Depends On: {subtask.depends_on.length > 0 ? subtask.depends_on.join(', ') : 'None'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
