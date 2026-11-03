from core.base.database.migration import Migration


class HookRequestsMigration(Migration):
    number = 1
    statements = ["CREATE TABLE hook_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, payload TEXT NOT NULL)"]
