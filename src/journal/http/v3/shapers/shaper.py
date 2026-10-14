from journal.http.v3.v3_row import V3Row
from journal.models.environment import Environment


class Shaper:
    """One version 3 type: which version 4 rows it is read from, and the row each becomes. A type with no rows of its own answers none."""

    type: str

    def rows(self, environment: Environment) -> list[V3Row]:
        return []

    def count_all(self, environment: Environment) -> int:
        return len(self.rows(environment))
