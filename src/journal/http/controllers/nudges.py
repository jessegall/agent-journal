from journal.http.controllers.controller import Controller
from journal.models.entry import Entry
from journal.repositories.entries import Entries

NUDGE = "nudge"
SHOWN = 200


class NudgeController(Controller[Entry]):
    """The lines the journal typed to the agent, newest page, each an entry of its kind."""

    def __init__(self, entries: Entries) -> None:
        self.repository = entries

    def rows(self) -> list[Entry]:
        return list(reversed(self.repository.kind_entries(NUDGE, SHOWN)))
