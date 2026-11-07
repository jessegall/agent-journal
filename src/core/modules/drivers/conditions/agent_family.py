from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class AgentFamily:
    """Matches an agent and those it started. Every main agent of an environment counts as one, so a main agent also
    matches what an ended main agent of its environment started."""

    main_id: int

    def statement(self) -> Statement:
        return Statement("(id = ? OR parent_id = ? OR parent_id IN (SELECT other_main.id FROM agents other_main JOIN agents this_main"
                         " ON this_main.id = ? AND this_main.role = 'main' AND other_main.role = 'main'"
                         " AND other_main.environment_id = this_main.environment_id))", (self.main_id, self.main_id, self.main_id))
