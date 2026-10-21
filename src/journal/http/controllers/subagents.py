from journal.http.controllers.controller import Controller
from journal.models.subagent import Subagent
from journal.repositories.subagents import Subagents


class SubagentController(Controller[Subagent]):
    """The subagents dispatched here, as their rows stand: one running is open, whether it was just sent, works in the background or was resumed."""

    def __init__(self, subagents: Subagents) -> None:
        self.repository = subagents

    def rows(self) -> list[Subagent]:
        return self.repository.scoped()

    def is_open(self, row: Subagent) -> bool:
        return row.is_running()
