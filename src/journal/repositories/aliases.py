from journal.models.alias import Alias
from journal.repositories.repository import Repository


class Aliases(Repository[Alias]):
    """The project's aliases, one row each, the same for every environment."""

    model = Alias

    def index(self) -> dict[str, Alias]:
        return {alias.name: alias for alias in self.rows()}

    def plugin_rows(self, plugin: str) -> list[Alias]:
        return self.all_matching(plugin=plugin)
