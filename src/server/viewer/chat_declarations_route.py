from engine.database.write_turns import WriteTurns
from dataclasses import asdict

from engine.database.database import Database
from engine.module.journal_container import synced_container
from engine.journal.journal_home import JournalHome
from engine.registry.registry import Registry


class ChatDeclarationsRoute:
    """Answers GET /api/marks and GET /api/docks: every chat mark type and dockable item type the modules
    declare, each with the URL of its body file carrying its module's fingerprint, so a page reloads a
    body after an install or an upgrade."""

    def __init__(self, home: JournalHome, turns: WriteTurns | None = None) -> None:
        self.home, self.turns = home, turns

    def marks(self) -> list[dict[str, object]]:
        registry = self.registry()
        return [{**asdict(mark), "body_url": self.body_url(registry, mark.module, mark.body)} for mark in registry.marks]

    def docks(self) -> list[dict[str, object]]:
        registry = self.registry()
        return [{**asdict(dock), "body_url": self.body_url(registry, dock.module, dock.body)} for dock in registry.docks]

    def states(self) -> dict[str, dict[str, dict[str, object]]]:
        added: dict[str, dict[str, dict[str, object]]] = {}
        for entry in self.registry().state_additions:
            added.setdefault(entry.model_name, {})[entry.state] = {"label": entry.label, "looks_like": entry.looks_like, "open_moves": list(entry.open_moves), "module": entry.module, "tip_read": entry.tip_read}
        return added

    def registry(self) -> Registry:
        container = synced_container(self.home, self.turns)
        try:
            return container.get(Registry)
        finally:
            container.get(Database).close()

    @staticmethod
    def body_url(registry: Registry, module: str, body: str) -> str:
        return f"/modules/{module}/{body}?v={registry.module_fingerprints[module]}" if body else ""
