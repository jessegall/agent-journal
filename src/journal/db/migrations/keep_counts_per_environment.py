from typing import ClassVar

from journal.db.migration import Migration


class KeepCountsPerEnvironment(Migration):
    """A workflow's counts were kept per agent and are now kept per environment: of the agents' counts by one name in one environment, the highest is kept as the environment's, so a value in use carries across; counts and noted times are found by name."""

    number: ClassVar[int] = 15
    statements: ClassVar[tuple[str, ...]] = (
        "DROP INDEX IF EXISTS counts_by_session",
        "CREATE INDEX IF NOT EXISTS counts_by_name ON counts (environment_id, name)",
        "CREATE INDEX IF NOT EXISTS noted_times_by_name ON noted_times (environment_id, name)",
        "DELETE FROM counts WHERE id NOT IN (SELECT id FROM (SELECT id, ROW_NUMBER() OVER (PARTITION BY environment_id, name ORDER BY value DESC, id) AS kept FROM counts) WHERE kept = 1)",
    )
