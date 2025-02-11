import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from "react";
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ViewList,
  AccountTree,
} from "@mui/icons-material";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyEdgeChanges,
  applyNodeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976D2",
    },
    secondary: {
      main: "#2E7D32",
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#212121",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

// API configuration
const API_BASE_URL = "http://localhost:8000";
const api = axios.create({
  baseURL: API_BASE_URL,
});

interface Task {
  id: number;
  title: string;
  description: string;
  parent_id: number | null;
  status: string;
  position?: { x: number; y: number };
}

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

interface FormData {
  title: string;
  description: string;
  parent_id: string;
  status: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<"list" | "flow">("list");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: "",
    severity: "success",
  });

  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    parent_id: "",
    status: "todo",
  });

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await api.get<Task[]>("/tasks/");
      setTasks(response.data);
      updateFlowElements(response.data);
    } catch (error) {
      showAlert("Error fetching tasks", "error");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Convert tasks to flow elements
  const updateFlowElements = (taskList: Task[]) => {
    const newNodes = taskList.map((task) => ({
      id: task.id.toString(),
      type: "default",
      data: {
        label: (
          <div style={{ padding: "10px" }}>
            <Typography variant="subtitle2">{task.title}</Typography>
            <Typography variant="caption" color="textSecondary">
              {task.status}
            </Typography>
          </div>
        ),
      },
      position: task.position
        ? task.position
        : { x: Math.random() * 500, y: Math.random() * 300 },
      style: {
        background: "#fff",
        border: "1px solid #1976D2",
        borderRadius: "8px",
        padding: "10px",
      },
    }));

    const newEdges = taskList
      .filter((task) => task.parent_id)
      .map((task) => ({
        id: `e${task.parent_id}-${task.id}`,
        source: task.parent_id!.toString(),
        target: task.id.toString(),
        type: "smoothstep",
        animated: true,
        style: { stroke: "#1976D2" },
      }));

    setNodes(newNodes);
    setEdges(newEdges);
  };

  // Handle node changes in flow view
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  // Handle edge changes in flow view
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  // Show alert message
  const showAlert = (message: string, severity: AlertState["severity"] = "success") => {
    setAlert({ open: true, message, severity });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (selectedTask) {
        await api.put(`/tasks/${selectedTask.id}`, formData);
        showAlert("Task updated successfully");
      } else {
        await api.post("/tasks/", formData);
        showAlert("Task created successfully");
      }
      handleCloseDialog();
      fetchTasks();
    } catch (error) {
      showAlert("Error saving task", "error");
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      showAlert("Task deleted successfully");
      fetchTasks();
    } catch (error) {
      showAlert("Error deleting task", "error");
    }
  };

  // Dialog handlers
  const handleOpenDialog = (task: Task | null = null) => {
    setSelectedTask(task);
    setFormData(
      task || {
        title: "",
        description: "",
        parent_id: "",
        status: "todo",
      }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Task Manager
            </Typography>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(e, newView) => newView && setView(newView)}
              aria-label="view mode"
            >
              <ToggleButton value="list" aria-label="list view">
                <ViewList />
              </ToggleButton>
              <ToggleButton value="flow" aria-label="flow view">
                <AccountTree />
              </ToggleButton>
            </ToggleButtonGroup>
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 4 }}>
          {view === "list" ? (
            <Paper elevation={2}>
              <List>
                {tasks.map((task) => (
                  <ListItem
                    key={task.id}
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleOpenDialog(task)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {task.status}
                          </Typography>
                          {" — "}
                          {task.description}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          ) : (
            <Paper sx={{ height: "70vh" }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
              >
                <Background />
                <Controls />
                <MiniMap />
              </ReactFlow>
            </Paper>
          )}

          {/* Add Task FAB */}
          <Fab
            color="primary"
            aria-label="add"
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            onClick={() => handleOpenDialog()}
          >
            <AddIcon />
          </Fab>

          {/* Task Dialog */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              {selectedTask ? "Edit Task" : "Create New Task"}
            </DialogTitle>
            <DialogContent>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Stack spacing={2}>
                  <TextField
                    label="Title"
                    value={formData.title}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    fullWidth
                    required
                  />
                  <TextField
                    label="Description"
                    value={formData.description}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    fullWidth
                    multiline
                    rows={3}
                  />
                  <TextField
                    label="Parent Task ID"
                    value={formData.parent_id}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, parent_id: e.target.value })
                    }
                    fullWidth
                    type="number"
                  />
                  <TextField
                    select
                    label="Status"
                    value={formData.status}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    fullWidth
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </TextField>
                  <Button type="submit" variant="contained" color="primary">
                    {selectedTask ? "Update Task" : "Create Task"}
                  </Button>
                </Stack>
              </Box>
            </DialogContent>
          </Dialog>

          {/* Alert Snackbar */}
          <Snackbar
            open={alert.open}
            autoHideDuration={6000}
            onClose={() => setAlert({ ...alert, open: false })}
          >
            <Alert
              onClose={() => setAlert({ ...alert, open: false })}
              severity={alert.severity}
              sx={{ width: "100%" }}
            >
              {alert.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
