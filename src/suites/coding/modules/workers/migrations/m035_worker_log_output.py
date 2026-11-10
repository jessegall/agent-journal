from engine.database.migration import Migration


class WorkerLogOutputMigration(Migration):
    number = 35
    statements = ["ALTER TABLE worker_worktrees ADD COLUMN logs_output_id INTEGER REFERENCES processes(id)",
                  "CREATE INDEX worker_worktrees_log_output ON worker_worktrees (logs_output_id)",
                  "ALTER TABLE merger_lines ADD COLUMN read_output_id INTEGER REFERENCES processes(id)",
                  "CREATE INDEX merger_lines_read_output ON merger_lines (read_output_id)"]
