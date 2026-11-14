from engine.database.migration import Migration


class ProcessRunNamesMigration(Migration):
    """Names a process's plugin run or merge by run_name, and a request run's type by process_type, with the type
    that edits a file called edit."""

    number = 75
    statements = ["ALTER TABLE processes RENAME COLUMN kind TO run_name",
                  "ALTER TABLE request_runs RENAME COLUMN kind TO process_type",
                  "UPDATE request_runs SET process_type = 'edit' WHERE process_type = 'write'"]
