from journal.models.plugin import Plugin
from journal.support.not_found import NotFound
from journal.repositories.repository import Repository


class Plugins(Repository[Plugin]):
    """The plugins installed in the project, one row each, the same for every environment."""

    model = Plugin

    def named(self, name: str) -> Plugin:
        found = self.where(name=name)
        if not found:
            raise NotFound(self.table, name)
        return found[0]

    def enabled(self) -> list[Plugin]:
        return [p for p in self.all() if p.enabled]
