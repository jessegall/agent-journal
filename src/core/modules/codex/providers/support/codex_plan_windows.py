import json

from engine.provider.plan_window import PlanWindow
from engine.types.type_guards import is_mapping


class CodexPlanWindows:
    """The account allowance windows Codex writes beside its token counts."""

    @classmethod
    def parsed(cls, line: str) -> tuple[PlanWindow, ...]:
        fields: object = json.loads(line)
        payload = fields.get("payload") if is_mapping(fields) else None
        limits = payload.get("rate_limits") if is_mapping(payload) and payload.get("type") == "token_count" else None
        if not is_mapping(limits) or limits.get("limit_id") not in (None, "codex"):
            return ()
        return tuple(window for key in ("primary", "secondary") if (window := cls.window(limits.get(key))) is not None)

    @classmethod
    def window(cls, fields: object) -> PlanWindow | None:
        if not is_mapping(fields):
            return None
        minutes, used, resets = fields.get("window_minutes"), fields.get("used_percent"), fields.get("resets_at")
        if not isinstance(minutes, int) or minutes <= 0 or not isinstance(used, int | float) or not isinstance(resets, int | float):
            return None
        return PlanWindow(cls.title(minutes), float(used), float(resets))

    @staticmethod
    def title(minutes: int) -> str:
        if minutes % 1440 == 0:
            return f"{minutes // 1440} days"
        if minutes % 60 == 0:
            return f"{minutes // 60} hours"
        return f"{minutes} minutes"
