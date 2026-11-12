from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType
from suites.coding.models.enums.ask_topic import AskTopic

WORKER_TASK_STARTED = NudgeDeclaration("coding.worker_task_started", NudgeType.REFUSAL, 'Not finished: {line}', path_fields=["line"])
WORKER_TASK_UNSTARTED = NudgeDeclaration("coding.worker_task_not_started", NudgeType.REFUSAL, 'your task has not started yet: only reading and journal commands run until it does')
WORKER_GIT_BAN = NudgeDeclaration("coding.worker_runs_no_git", NudgeType.REFUSAL, 'a worker runs no git: the journal commits and merges your work. ' + AskTopic.TOOL.question_line(), full_text=True)
WORKER_COMMAND_TYPE = NudgeDeclaration("coding.worker_command_type", NudgeType.REFUSAL, 'a worker here runs no {category} command. ' + AskTopic.TOOL.question_line(), full_text=True)
MAIN_HELPER_BAN = NudgeDeclaration("coding.main_starts_no_helpers", NudgeType.REFUSAL, 'the main agent starts no read-only helpers here: {then}')
MAIN_CODE_EDIT_REFUSED = NudgeDeclaration("coding.main_writes_no_code", NudgeType.REFUSAL, 'the main agent writes no code here: send the work to a worker')
TASK_ASSIGNMENT = NudgeDeclaration("coding.task_is_yours", NudgeType.REFUSAL, 'task:{task} is yours now')
OPEN_TASKS_WAIT = NudgeDeclaration("coding.open_tasks_wait", NudgeType.REFUSAL, 'open tasks wait for a worker: {tasks}')

FREE_WORKER_PLACE = NudgeDeclaration("coding.free_worker_place", NudgeType.REFUSAL, 'tasks can go to a worker and a place is free ({count} free): {tasks}; send them or say why not, then you may stop')

UNFINISHED_TASKS = NudgeDeclaration("coding.unfinished_tasks", NudgeType.REFUSAL, 'tasks {tasks} are yours and unfinished: start one, block it with what it waits on, or say why you stop')

INTRODUCTION_NUDGE = NudgeDeclaration("coding.introduce_yourself", NudgeType.STEERING, "introduce yourself in the chat in one or two lines, then ask what to do unless the user has already asked")
WAITING_ITEMS = NudgeDeclaration("coding.waiting_items", NudgeType.STEERING, "waiting for you: {items}")
WORKER_FULL_TEST_RUN = NudgeDeclaration("coding.worker_full_test_run", NudgeType.REFUSAL, 'a worker runs only the tests of what it changed, never the whole suite: name the test files. ' + AskTopic.TOOL.question_line(), turn_limited=False, full_text=True)
GIT_RESTRICTION = NudgeDeclaration("drivers.no_git", NudgeType.SAFETY_REFUSAL, "this driver runs no git commands")
FULL_TEST_RESTRICTION = NudgeDeclaration("drivers.no_full_test_run", NudgeType.SAFETY_REFUSAL, "run the tests of the changed files; name the test files instead of running the whole suite", turn_limited=False)
FAILED_FULL_RUN = NudgeDeclaration("processes.failed_full_run", NudgeType.REFUSAL, "your last full test run failed: re-run the failed tests by name first", turn_limited=False)
CODING_NUDGES = [GIT_RESTRICTION, FULL_TEST_RESTRICTION, FAILED_FULL_RUN, WORKER_FULL_TEST_RUN, INTRODUCTION_NUDGE, WAITING_ITEMS, WORKER_TASK_STARTED, WORKER_TASK_UNSTARTED, WORKER_GIT_BAN, WORKER_COMMAND_TYPE, MAIN_HELPER_BAN, MAIN_CODE_EDIT_REFUSED, TASK_ASSIGNMENT, OPEN_TASKS_WAIT, FREE_WORKER_PLACE, UNFINISHED_TASKS]
