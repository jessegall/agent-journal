from engine.database.statement import Statement
from core.modules.tasks.models.enums.task_state import TaskState


class ProofTaskTesting:
    """Matches proofs whose task is ready for checking."""

    def statement(self) -> Statement:
        return Statement("EXISTS (SELECT 1 FROM tasks WHERE tasks.id = proofs.task_id AND tasks.state = ?)", [TaskState.TESTING])
