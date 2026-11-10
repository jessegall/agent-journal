from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.nudge_type import NudgeType

JOB_STOPPED = NudgeDeclaration("schedules.job_stopped", NudgeType.STEERING, "the user stopped your scheduled job {job}: delete it with CronDelete, id {job}")
SCHEDULE_NUDGES = [JOB_STOPPED]
