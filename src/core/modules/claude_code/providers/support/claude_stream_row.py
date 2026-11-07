import json
from collections.abc import Iterator
from dataclasses import dataclass

from core.base.type_guards import is_mapping


@dataclass(frozen=True)
class ClaudeStreamRow:
    """One row of Claude Code's stream-json output: its type, the session it ran, and for the result row the
    report and whether it ended in an error."""

    row_type: str
    session: str
    report: str
    is_error: bool

    @classmethod
    def rows(cls, output: str) -> Iterator["ClaudeStreamRow"]:
        for line in output.splitlines():
            try:
                fields: object = json.loads(line)
            except json.JSONDecodeError:
                continue
            if is_mapping(fields):
                report = fields.get("result")
                yield cls(str(fields.get("type", "")), str(fields.get("session_id", "")), report if isinstance(report, str) else "", fields.get("is_error") is True)
