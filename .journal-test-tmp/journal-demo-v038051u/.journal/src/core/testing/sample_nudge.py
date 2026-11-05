from core.base.driver.nudge import Nudge
from core.base.driver.nudge_type import NudgeType


def sample_nudge(text: str, type: NudgeType = NudgeType.STEERING) -> Nudge:
    return Nudge("sample.line", type, text, turn_limited=False)
