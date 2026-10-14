from journal.models.link import Link
from journal.models.model import Model
from journal.models.ref import Ref
from journal.repositories.repository import Repository


class Links(Repository[Link]):
    """Checks both ends exist on save, since the database cannot."""

    model = Link

    def of(self, model: Model) -> list[Link]:
        """Every link from or to this row."""
        ...

    def targets(self, model: Model, kind: str = "") -> list[Ref]: ...

    def sources(self, model: Model, kind: str = "") -> list[Ref]: ...

    def between(self, source: Model, target: Model) -> list[Link]: ...
