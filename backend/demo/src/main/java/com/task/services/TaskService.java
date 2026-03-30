package com.task.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.task.repository.TaskRepository;
import com.task.dto.TaskDTO;
import com.task.exception.TaskNotFoundException;
import com.task.model.Task;
import com.task.model.TaskStatus;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;
    
    // Get all tasks
    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll().stream().map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TaskDTO getTaskById(Long id) {
        return taskRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new TaskNotFoundException(id));
    }
       // Convert Task entity to TaskDTO
    private TaskDTO convertToDTO(Task task) {
        TaskDTO dto = new TaskDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getDueDate()
        );
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        return dto;
    }
        // Create new task
    public TaskDTO createTask(TaskDTO request) {
        Task task = new Task(
                request.getTitle(),
                request.getDescription(),
                request.getStatus() != null ? request.getStatus() : TaskStatus.TODO,
                request.getDueDate()
        );
        Task savedTask = taskRepository.save(task);
        return convertToDTO(savedTask);
    }
        // Update task
    public Optional<TaskDTO> updateTask(Long id, TaskDTO request) {
        return taskRepository.findById(id)
                .map(task -> {
                    task.setTitle(request.getTitle());
                    task.setDescription(request.getDescription());
                    if (request.getStatus() != null) {
                        task.setStatus(request.getStatus());
                    }
                    task.setDueDate(request.getDueDate());
                    Task updatedTask = taskRepository.save(task);
                    return convertToDTO(updatedTask);
                });
    }
        // Delete task
    public boolean deleteTask(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
