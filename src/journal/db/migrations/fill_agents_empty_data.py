from typing import ClassVar

from journal.db.migration import Migration


class FillAgentsEmptyData(Migration):
    """An agent's state data and the skills it read are always a map, an empty one where an older row held none."""

    number: ClassVar[int] = 17
    statements: ClassVar[tuple[str, ...]] = (
        "UPDATE agents SET data = '{}' WHERE data IS NULL",
        "UPDATE agents SET skills_loaded = '{}' WHERE skills_loaded IS NULL",
    )
