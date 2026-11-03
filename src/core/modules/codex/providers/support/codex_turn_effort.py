import json

from core.base.type_guards import is_mapping

TURN_CONTEXT_TYPE = "turn_context"


class CodexTurnEffort:
    """Reads the reasoning effort a turn of a Codex session ran at from a line of its rollout."""

    @staticmethod
    def parsed(line: str) -> str:
        fields: object = json.loads(line) if line.strip() else {}
        payload = fields.get("payload") if is_mapping(fields) and fields.get("type") == TURN_CONTEXT_TYPE else None
        effort = payload.get("effort") if is_mapping(payload) else None
        return effort if isinstance(effort, str) else ""
