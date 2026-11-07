from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

WORKER_TASK_STARTED = NudgeDeclaration("coding.worker_task_started", NudgeType.REFUSAL, 'task:{task} is not finished: go on, then journal worker next; if you cannot go on: journal wait stuck "<why>"')
WORKER_TASK_UNSTARTED = NudgeDeclaration("coding.worker_task_not_started", NudgeType.REFUSAL, 'your task has not started yet: only reading and journal commands run until it does')
WORKER_GIT_BAN = NudgeDeclaration("coding.worker_runs_no_git", NudgeType.REFUSAL, 'a worker runs no git: the journal commits and merges your work')
WORKER_COMMAND_TYPE = NudgeDeclaration("coding.worker_command_type", NudgeType.REFUSAL, 'a worker here runs no {category} command')
BUILDER_HELPER_BAN = NudgeDeclaration("coding.builder_starts_no_helpers", NudgeType.REFUSAL, 'the main agent starts no ordinary helpers here: {then}')
AUTO_OFF_FILE_WRITE = NudgeDeclaration("coding.auto_off_file_write", NudgeType.REFUSAL, 'auto mode is off, so the main agent writes no project file: send the work to a worker')
TASK_ASSIGNMENT = NudgeDeclaration("coding.task_is_yours", NudgeType.REFUSAL, 'task:{task} is yours now')
OPEN_TASKS_WAIT = NudgeDeclaration("coding.open_tasks_wait", NudgeType.REFUSAL, 'open tasks wait for a worker: {tasks}')

INTRODUCTION_NUDGE = NudgeDeclaration("coding.introduce_yourself", NudgeType.STEERING, "introduce yourself in the chat in one or two lines, then ask what to do unless the user has already asked")
WAITING_ITEMS = NudgeDeclaration("coding.waiting_items", NudgeType.STEERING, "waiting for you: {items}")
WORKER_FULL_TEST_RUN = NudgeDeclaration("coding.worker_full_test_run", NudgeType.REFUSAL, 'a worker runs only the tests of what it changed, never the whole suite: name the test files', turn_limited=False)
CODING_NUDGES = [WORKER_FULL_TEST_RUN, INTRODUCTION_NUDGE, WAITING_ITEMS, WORKER_TASK_STARTED, WORKER_TASK_UNSTARTED, WORKER_GIT_BAN, WORKER_COMMAND_TYPE, BUILDER_HELPER_BAN, AUTO_OFF_FILE_WRITE, TASK_ASSIGNMENT, OPEN_TASKS_WAIT]
