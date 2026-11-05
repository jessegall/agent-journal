import re
from enum import StrEnum

MAIN_AGENT = "main"
HELPER_AGENT = "helper"


class TriggerConditionType(StrEnum):
    """What a trigger's condition tests: which agent is working, its environment, the firings, or the hour."""

    AGENT = "agent"
    ENVIRONMENT = "environment"
    FIRED = "fired"
    HOURS = "hours"

    def accepts(self, value: str) -> bool:
        return re.fullmatch(VALUE_PATTERNS[self], value) is not None


VALUE_PATTERNS = {
    TriggerConditionType.AGENT: f"{MAIN_AGENT}|{HELPER_AGENT}",
    TriggerConditionType.ENVIRONMENT: r".+",
    TriggerConditionType.FIRED: r"\d+",
    TriggerConditionType.HOURS: r"\d{1,2}-\d{1,2}",
}
