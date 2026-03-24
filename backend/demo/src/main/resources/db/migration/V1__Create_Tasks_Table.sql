-- Create Task Table for H2 Database
DROP TABLE IF EXISTS task CASCADE;

CREATE TABLE task (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'TODO' CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for better query performance
CREATE INDEX idx_task_status ON task(status);
CREATE INDEX idx_task_due_date ON task(due_date);
CREATE INDEX idx_task_created_at ON task(created_at);

-- Verify table creation
SELECT * FROM task LIMIT 0;