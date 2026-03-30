package com.task;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.task.controller.TaskController;
import com.task.services.TaskService;

@SpringBootTest
class TaskmanagementApplicationTests {

	@Autowired
	private TaskController taskController;

	@Autowired
	private TaskService taskService;

	@Test
	void contextLoads() {
		assertNotNull(taskController);
		assertNotNull(taskService);
	}

}
