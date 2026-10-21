from journal.models.subagent import Subagent
from journal.repositories.scoped_repository import ScopedRepository


class Subagents(ScopedRepository[Subagent]):
    model = Subagent

    def session_subagents(self, session: str) -> list[Subagent]:
        return self.selected("dispatcher = ? ORDER BY id", (session,))

    def is_empty(self) -> bool:
        return not self.selected_globally("1 LIMIT 1")
