from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

WORKER_TASK_STARTED = NudgeDeclaration("coding.worker_task_started", NudgeType.REFUSAL, 'task {task}, {title}, is still started: finish it and deliver it with journal worker deliver')
WORKER_TASK_NOT_STARTED = NudgeDeclaration("coding.worker_task_not_started", NudgeType.REFUSAL, 'your task has not started yet: only journal commands run until it does')
WORKER_RUNS_NO_GIT = NudgeDeclaration("coding.worker_runs_no_git", NudgeType.REFUSAL, 'a worker runs no git: the journal commits and merges your work')
WORKER_COMMAND_TYPE = NudgeDeclaration("coding.worker_command_type", NudgeType.REFUSAL, 'a worker here runs no {category} command: {text}')
BUILDER_SENDS_NO_SUBAGENTS = NudgeDeclaration("coding.builder_sends_no_subagents", NudgeType.REFUSAL, 'the builder sends no subagents here: read and search yourself')
TASK_IS_YOURS = NudgeDeclaration("coding.task_is_yours", NudgeType.REFUSAL, 'task {task} is yours now: {title}')
SUBAGENT_READS_ONLY = NudgeDeclaration("coding.subagent_reads_only", NudgeType.REFUSAL, 'a subagent reads and searches only: the agent that sent it makes the change')
OPEN_TASKS_WAIT = NudgeDeclaration("coding.open_tasks_wait", NudgeType.REFUSAL, 'open tasks wait for a worker: {tasks}')

CODING_NUDGES = [WORKER_TASK_STARTED, WORKER_TASK_NOT_STARTED, WORKER_RUNS_NO_GIT, WORKER_COMMAND_TYPE, BUILDER_SENDS_NO_SUBAGENTS, TASK_IS_YOURS, SUBAGENT_READS_ONLY, OPEN_TASKS_WAIT]
