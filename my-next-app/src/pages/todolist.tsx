"use client";
import React, { useState, useMemo } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';

// 定义任务类型
interface Task {
  text: string;
  emoji: string;
  id: number;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<string>('');

  const addTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (task !== '') {
      const newTask: Task = { text: task, emoji: '', id: Date.now() };
      setTasks([...tasks, newTask]);
      setTask('');
    }
  };

  const addEmojiToTask = (taskId: number, emoji: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, emoji: emoji } : t));
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };


  function tasksToGrid(tasks: Task[], gridSize: number): (Task | null)[][] {
    const grid: (Task | null)[][] = [];
    tasks.forEach((task, i) => {
      if (i % gridSize === 0) grid.push([]);
      grid[grid.length - 1].push(task);
    });
  
    // Fill the remaining cells if the last row is not complete
    const lastRow = grid[grid.length - 1];
    if (lastRow && lastRow.length < gridSize) {
      while (lastRow.length < gridSize) {
        lastRow.push(null); // push null or an empty task for empty cells
      }
    }
  
    return grid; // 确保这里返回grid
  }
  

  const gridSize = 5; // assuming we want a 5x5 grid
  const taskGrid = useMemo(() => tasksToGrid(tasks, gridSize), [tasks]);

  const theme = useTheme();
  return (

      <div style={{ padding: theme.spacing(3)}}>
        <Grid container spacing={3} direction="column" alignItems="center" justifyContent="center">
  {/* 其他组件 */}
          <Grid item>
            <h1 style={{ color: theme.palette.primary.main }}>互动事件列表</h1>
          </Grid>


          <Grid item>
            <form onSubmit={addTask} noValidate autoComplete="off">
              <TextField
                label="添加新的事件"
                variant="outlined"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                required
              />
              <Button variant="contained" color="primary" type="submit" style={{ marginLeft: theme.spacing(1) }}>
                添加
              </Button>
            </form>
          </Grid>


          <Grid item>
            <div style={{ maxWidth: 1000, margin: 'auto' }}>
              {taskGrid.map((row, rowIndex) => (
                <Grid container spacing={1} key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <Grid item xs={15/ gridSize} key={cellIndex}>
                      <Paper style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center',overflow: 'hidden' }}>
                        {cell ? (
                          <>
                            <div>{cell.text} {cell.emoji}</div>
                            <Button onClick={() => addEmojiToTask(cell.id, '😀')} size="small">
                            emo
                            </Button>
                            <Button onClick={() => deleteTask(cell.id)} size="small">
                              删除
                            </Button>
                          </>
                        ) : (
                          <div>空</div>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ))}
            </div>
          </Grid>
        </Grid>
      </div>

  );
}

