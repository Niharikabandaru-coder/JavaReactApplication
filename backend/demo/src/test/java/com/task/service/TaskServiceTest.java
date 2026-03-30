package com.task.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.task.dto.TaskDTO;
import com.task.exception.TaskNotFoundException;
import com.task.model.Task;
import com.task.model.TaskStatus;
import com.task.repository.TaskRepository;
import com.task.services.TaskService;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository repository;

    @InjectMocks
    private TaskService service;

    @Test
    void shouldReturnAllTasks() {
        List<Task> tasks = List.of(new Task(), new Task());
        when(repository.findAll()).thenReturn(tasks);

        List<TaskDTO> result = service.getAllTasks();

        assertEquals(2, result.size());
    }

    @Test
    void shouldReturnTaskById() {
        Task task = new Task();
        task.setId(1L);

        when(repository.findById(1L)).thenReturn(Optional.of(task));

        TaskDTO result = service.getTaskById(1L);

        assertEquals(1L, result.getId());
    }

    @Test
    void shouldThrowWhenTaskNotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(TaskNotFoundException.class,
                () -> service.getTaskById(1L));
    }

    @Test
    void shouldCreateTask() {
        Task task = new Task();
        task.setTitle("Test");

        when(repository.save(any(Task.class))).thenReturn(task);

        TaskDTO result = service.createTask(new TaskDTO(9L, "Test Task Service", null, null, null));

        assertEquals("Test", result.getTitle());
    }

    @Test
    void shouldDeleteTask() {
        when(repository.existsById(9L)).thenReturn(true);
        service.deleteTask(9L);
        verify(repository).deleteById(9L);
    }

    @Test
    void shouldUpdateTask() {
        // Arrange
        Long id = 1L;

        Task existingTask = new Task();
        existingTask.setId(id);
        existingTask.setTitle("Old Title");
        existingTask.setDescription("Old Desc");
        existingTask.setStatus(TaskStatus.TODO);

        TaskDTO request = new TaskDTO();
        request.setTitle("New Title");
        request.setDescription("New Desc");
        request.setStatus(TaskStatus.DONE);

        when(repository.findById(id)).thenReturn(Optional.of(existingTask));
        when(repository.save(any(Task.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Optional<TaskDTO> result = service.updateTask(id, request);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("New Title", result.get().getTitle());
        assertEquals("New Desc", result.get().getDescription());
        assertEquals(TaskStatus.DONE, result.get().getStatus());

        verify(repository).findById(id);
        verify(repository).save(existingTask);
    }

    @Test
    void shouldReturnEmptyWhenTaskNotFound() {
        Long id = 1L;

        TaskDTO request = new TaskDTO();
        request.setTitle("New Title");

        when(repository.findById(id)).thenReturn(Optional.empty());

        // Act
        Optional<TaskDTO> result = service.updateTask(id, request);

        // Assert
        assertTrue(result.isEmpty());

        verify(repository).findById(id);
        verify(repository, never()).save(any());
    }

    @Test
    void shouldNotUpdateStatusWhenNull() {
        Long id = 1L;

        Task existingTask = new Task();
        existingTask.setId(id);
        existingTask.setStatus(TaskStatus.TODO);

        TaskDTO request = new TaskDTO();
        request.setTitle("Updated Title");
        request.setStatus(null); // important

        when(repository.findById(id)).thenReturn(Optional.of(existingTask));
        when(repository.save(any(Task.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Optional<TaskDTO> result = service.updateTask(id, request);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(TaskStatus.TODO, existingTask.getStatus()); // unchanged
    }
}