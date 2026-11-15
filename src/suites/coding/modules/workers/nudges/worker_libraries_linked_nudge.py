from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerLibrariesLinkedNudge(NudgeDeclaration):
    """The nudge workers.libraries_linked."""

    key = "workers.libraries_linked"
    type = NudgeType.STEERING
    text = "Your worktree's libraries are linked: rerun your tests"
    turn_limited = False
    wakes_agent = True
