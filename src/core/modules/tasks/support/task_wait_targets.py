from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.refusal import Refusal

TARGET_TABLES = {"task": "tasks", "question": "questions", "plan": "plans"}
FINISHED_STATES = ("completed", "cancelled", "answered", "closed")
TARGET_HELP = "write --on task:<n>, --on question:<n>, --on plan:<n> or --on worker:<n>"


class TaskWaitTargets:
    """Validates the rows a task can wait on and returns their stored references."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def target(self, target_type: str, row_id: int) -> str:
        table = TARGET_TABLES.get(target_type)
        if table is None:
            raise Refusal(f"{target_type}:{row_id} gives nothing to wait on", TARGET_HELP)
        rows = self.database.rows(Statement.row_state(table, row_id))
        if not rows:
            raise Refusal(f"{target_type} {row_id} does not exist", "name a row that does")
        if rows[0]["state"] in FINISHED_STATES:
            raise Refusal(f"{target_type} {row_id} is {rows[0]['state']} already", "nothing waits on it; carry on with the task")
        return f"{table}:{row_id}"
