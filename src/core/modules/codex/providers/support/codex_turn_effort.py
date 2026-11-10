import json

from engine.types.type_guards import is_mapping

TURN_CONTEXT_TYPE = "turn_context"


class CodexTurnEffort:
    """Reads what a turn of a Codex session ran at from a line of its rollout: its reasoning effort, or with
    `field="model"` the model."""

    @staticmethod
    def parsed(line: str, field: str = "effort") -> str:
        fields: object = json.loads(line) if line.strip() else {}
        payload = fields.get("payload") if is_mapping(fields) and fields.get("type") == TURN_CONTEXT_TYPE else None
        value = payload.get(field) if is_mapping(payload) else None
        return value if isinstance(value, str) else ""
