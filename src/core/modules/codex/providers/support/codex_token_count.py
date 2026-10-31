import json
from dataclasses import dataclass

from core.base.type_guards import is_mapping


@dataclass(frozen=True)
class CodexTokenCount:
    """A token count line of a Codex session's rollout: the tokens the last turn used_tokens of the model's context
    window_tokens."""

    used_tokens: int
    window_tokens: int

    @classmethod
    def parsed(cls, line: str) -> "CodexTokenCount | None":
        fields: object = json.loads(line) if line.strip() else {}
        payload = fields.get("payload") if is_mapping(fields) else None
        token_count = payload.get("info") if is_mapping(payload) and payload.get("type") == "token_count" else None
        usage = token_count.get("last_token_usage") if is_mapping(token_count) else None
        used_tokens = usage.get("total_tokens") if is_mapping(usage) else None
        window_tokens = token_count.get("model_context_window") if is_mapping(token_count) else None
        return cls(used_tokens, window_tokens) if isinstance(used_tokens, int) and isinstance(window_tokens, int) and window_tokens > 0 else None

    def percent(self) -> int:
        return self.used_tokens * 100 // self.window_tokens
