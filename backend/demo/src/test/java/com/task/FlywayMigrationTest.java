package com.task;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.sql.Connection;
import java.sql.ResultSet;

import javax.sql.DataSource;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@AutoConfigureTestDatabase
class FlywayMigrationTest {

    @Autowired
    private DataSource dataSource;

    @Test
    void shouldHaveTaskTable() throws Exception {
        try (Connection conn = dataSource.getConnection()) {
            ResultSet rs = conn.getMetaData()
                    .getTables(null, null, "TASK", null);

            assertTrue(rs.next(), "TASK table should exist");
        }
    }
}
