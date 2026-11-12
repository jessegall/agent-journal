from dataclasses import dataclass

from engine.database.statement import Statement

TASK_ASSIGNMENTS = "SELECT subject_id FROM assignments WHERE subject_model = 'task'"
MAIN_TAKEABLE = (f"state = 'open' AND (id NOT IN ({TASK_ASSIGNMENTS})"
                 f" OR id IN ({TASK_ASSIGNMENTS} AND actor_id IN (SELECT id FROM agents WHERE role = 'main')))")
ASSIGNED_TAKEABLE = f"state = 'open' AND id IN ({TASK_ASSIGNMENTS} AND actor_id = ?)"


@dataclass(frozen=True)
class TakeableTasks:
    """Matches the open tasks one agent may take: for the main agent the tasks assigned to nobody or to the main
    agent, for any other agent only the tasks assigned to it."""

    agent_id: int
    is_main: bool

    def statement(self) -> Statement:
        return Statement(MAIN_TAKEABLE, []) if self.is_main else Statement(ASSIGNED_TAKEABLE, [self.agent_id])
