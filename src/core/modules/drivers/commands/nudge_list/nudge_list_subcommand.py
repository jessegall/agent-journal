from argparse import ArgumentParser, Namespace
from collections import Counter

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.registry.registry import Registry
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.modules.drivers.models.nudge_record import NudgeRecord
from core.modules.drivers.support.nudge_row import NudgeRow


class NudgeListSubcommand(ReadSubcommand[tuple[NudgeRow, ...]]):
    """`journal nudge list`: every nudge the modules declare, its type and words, and how often it was said."""

    cli_name = "nudge"
    name = "list"

    def __init__(self, registry: Registry, queries: Queries) -> None:
        self.registry, self.queries = registry, queries

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> tuple[NudgeRow, ...]:
        counts: Counter[str] = Counter()
        latest: dict[str, str] = {}
        for record in self.queries.query(NudgeRecord).all_rows():
            counts[record.key] += record.said_count
            if record.last_said_at is not None:
                latest[record.key] = max(latest.get(record.key, ""), record.last_said_at.text)
        return tuple(NudgeRow(entry.key, entry.module, entry.type, entry.text, entry.repeat_seconds, counts[entry.key], latest.get(entry.key, "")) for entry in self.registry.nudges)

    def write_output(self, value: object, output: Output) -> None:
        if is_tuple(value):
            rows = [row for row in value if isinstance(row, NudgeRow)]
            output.write("\n".join(f"{row.key}: {row.type}, said {row.said_count} times" for row in rows), {"rows": [row.json() for row in rows]})
