from dataclasses import dataclass

from journal.providers.support.json_line import JsonLine

# the lines that show the session begun: its init line, and every message or result after it; a hook's lines come before it
WORK_TYPES = ("assistant", "user", "result")
INIT_SUBTYPE = "init"


@dataclass(frozen=True)
class ClaudeStreamRow(JsonLine):
    """One line of a Claude Code worker's stream-json output, as far as the journal reads it: the session it names, its answer when it is the run's result line, whether that answer is an error, what the run cost in dollars, and whether it shows the session begun."""

    session: str | None
    answer: str | None
    is_error: bool
    cost_dollars: float = 0.0
    is_work: bool = False

    @classmethod
    def blank(cls) -> "ClaudeStreamRow":
        return cls(None, None, False)

    @classmethod
    def built(cls, data: dict) -> "ClaudeStreamRow":
        answer = data.get("result")
        return cls(data.get("session_id") or None, None if answer is None else str(answer), bool(data.get("is_error")), float(data.get("total_cost_usd") or 0.0), data.get("type") in WORK_TYPES or data.get("subtype") == INIT_SUBTYPE)
