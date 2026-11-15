from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class JobStoppedNudge(NudgeDeclaration):
    """The nudge schedules.job_stopped."""

    key = "schedules.job_stopped"
    type = NudgeType.STEERING
    text = "The user stopped scheduled job {job}: delete it with CronDelete, id {job}"
