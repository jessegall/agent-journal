from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

JOB_STOPPED = NudgeDeclaration("schedules.job_stopped", NudgeType.STEERING, "The user stopped scheduled job {job}: delete it with CronDelete, id {job}")
SCHEDULE_NUDGES = [JOB_STOPPED]
