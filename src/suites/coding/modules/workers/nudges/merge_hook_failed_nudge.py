from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MergeHookFailedNudge(NudgeDeclaration):
    """The nudge workers.merge_hook_failed."""

    key = "workers.merge_hook_failed"
    type = NudgeType.STEERING
    text = "the merge hook {command!r} of worker:{worker} failed, and its merge stands: run it in the checkout to read its output"
    wakes_agent = True
