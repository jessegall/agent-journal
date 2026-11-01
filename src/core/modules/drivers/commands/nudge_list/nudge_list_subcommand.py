from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.registry.registry import Registry
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.drivers.support.nudge_board import NudgeRow

SAID = Statement("SELECT key, SUM(said_count) AS said_count, MAX(last_said_at) AS last_said_at FROM nudge_records GROUP BY key")


class NudgeListSubcommand(ReadSubcommand[tuple[NudgeRow, ...]]):
    """`journal nudge list`: every nudge the modules declare, its type and words, and how often it was said."""

    cli_name = "nudge"
    name = "list"

    def __init__(self, registry: Registry, database: Database) -> None:
        self.registry, self.database = registry, database

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> tuple[NudgeRow, ...]:
        said = {row["key"]: row for row in self.database.rows(SAID)}
        return tuple(NudgeRow(entry.key, entry.module, entry.type, entry.text, entry.repeat_seconds, said[entry.key]["said_count"] if entry.key in said else 0, said[entry.key]["last_said_at"] if entry.key in said else "")
                     for entry in self.registry.nudges)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, tuple):
            rows = [row for row in value if isinstance(row, NudgeRow)]
            output.write("\n".join(f"{row.key}: {row.type}, said {row.said_count} times" for row in rows), {"rows": [row.json() for row in rows]})
