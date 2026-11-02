from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

JOB_STOPPED = NudgeDeclaration("schedules.job_stopped", NudgeType.INSTRUCTION, "the user stopped your scheduled job {job}: delete it with CronDelete, id {job}", required_command="")
SCHEDULE_NUDGES = [JOB_STOPPED]
