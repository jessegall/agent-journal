from typing import TypeVar

from journal.models.scoped import Scoped
from journal.repositories.scoped_repository import ScopedRepository
from journal.support.value_name import ValueName

V = TypeVar("V", bound=Scoped)


class WorkflowValueRows(ScopedRepository[V]):
    """The rows of the values workflows keep, each named for its workflow and its own name: a count's, a time's."""

    def of_workflow(self, workflow: int) -> dict:
        """What a workflow keeps in this environment, by the values' names."""
        prefix = ValueName.prefix(workflow)
        return {row.name[len(prefix):]: row.kept for row in self.selected("name LIKE ? ORDER BY id", (f"{prefix}%",))}

    def everywhere_of_workflow(self, workflow: int) -> list[V]:
        """A workflow's rows in every environment, for what ends them all."""
        return self.selected_everywhere("name LIKE ? ORDER BY id", (f"{ValueName.prefix(workflow)}%",))
