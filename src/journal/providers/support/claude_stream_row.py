from dataclasses import dataclass

from journal.providers.support.json_line import JsonLine


@dataclass(frozen=True)
class ClaudeStreamRow(JsonLine):
    """One line of a Claude Code worker's stream-json output, as far as the journal reads it: the session it names, its answer when it is the run's result line, and whether that answer is an error."""

    session: str | None
    answer: str | None
    is_error: bool

    @classmethod
    def blank(cls) -> "ClaudeStreamRow":
        return cls(None, None, False)

    @classmethod
    def built(cls, data: dict) -> "ClaudeStreamRow":
        answer = data.get("result")
        return cls(data.get("session_id") or None, None if answer is None else str(answer), bool(data.get("is_error")))
