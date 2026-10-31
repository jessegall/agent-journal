from dataclasses import asdict

from core.base.database.database import Database
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome
from core.base.registry.registry import Registry


class ChatDeclarationsRoute:
    """Answers GET /api/marks and GET /api/docks: every chat mark type and dockable item type the modules declare,
    each with the URL of its body file carrying its module's fingerprint, so a page reloads a body after an install or
    an upgrade."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def marks(self) -> list[dict[str, object]]:
        registry = self.registry()
        return [{**asdict(mark), "body_url": self.body_url(registry, mark.module, mark.body)} for mark in registry.marks]

    def docks(self) -> list[dict[str, object]]:
        registry = self.registry()
        return [{**asdict(dock), "body_url": self.body_url(registry, dock.module, dock.body)} for dock in registry.docks]

    def registry(self) -> Registry:
        container = synced_container(self.home)
        try:
            return container.get(Registry)
        finally:
            container.get(Database).close()

    @staticmethod
    def body_url(registry: Registry, module: str, body: str) -> str:
        return f"/modules/{module}/{body}?v={registry.module_fingerprints[module]}" if body else ""
