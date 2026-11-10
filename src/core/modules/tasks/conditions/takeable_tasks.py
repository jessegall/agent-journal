from dataclasses import dataclass

from engine.database.statement import Statement

MAIN_TAKEABLE = "state = 'open' AND (delegated_to IS NULL OR delegated_to IN (SELECT id FROM agents WHERE role = 'main'))"
ASSIGNED_TAKEABLE = "state = 'open' AND delegated_to = ?"


@dataclass(frozen=True)
class TakeableTasks:
    """Matches the open tasks one agent may take: for the main agent the tasks reserved for nobody or for the main
    agent, for any other agent only the tasks assigned to it."""

    agent_id: int
    is_main: bool

    def statement(self) -> Statement:
        return Statement(MAIN_TAKEABLE, []) if self.is_main else Statement(ASSIGNED_TAKEABLE, [self.agent_id])
