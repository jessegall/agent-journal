from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

HELPER_INACTIVE = NudgeDeclaration("workers.helper_inactive", NudgeType.INSTRUCTION, '{name}:{agent} has used no tool for {minutes} minutes: check on it', turn_limited=False)
BUILDER_BUILDS = NudgeDeclaration("workers.builder_builds", NudgeType.REFUSAL, 'this builder builds its tasks itself: coding.builder-dispatches-workers is false')
PROOF_CHECK = NudgeDeclaration("workers.check_the_proof", NudgeType.REFUSAL, 'worker:{worker} delivered task:{task}: journal proof check {proofs}, or journal proof short <proof> "<what is missing>"')
MERGE_WAITS = NudgeDeclaration("workers.merge_waits", NudgeType.INSTRUCTION, 'the merge of worker {worker} waits for the checkout of environment {environment} to return to {branch}', turn_limited=False)
WORKER_TASK = NudgeDeclaration("workers.worker_holds_task", NudgeType.NUDGE, 'worker:{worker} holds task:{task}: its worktree is {state}')

WORKER_UNMERGED = NudgeDeclaration("workers.worker_unmerged", NudgeType.NUDGE, 'worker:{worker} delivered {tasks}, unmerged: journal worker merge {worker}, or journal worker release {worker}', interval=Interval(Seconds(600)), turn_limited=False)

SMALL_BATCH = NudgeDeclaration("workers.small_batch", NudgeType.NUDGE, 'batch of {count}: queue more tasks on a worker, a long batch runs on and bothers you less', turn_limited=False)

WORKER_RETIRED = NudgeDeclaration("workers.worker_retired", NudgeType.NUDGE, 'worker:{worker} was idle too long: released, task:{task} is open again', turn_limited=False)

WORKER_FILE = NudgeDeclaration("workers.file_is_the_workers", NudgeType.REFUSAL, "that file is in worker {worker}'s worktree: journal worker send {worker} \"<job>\", or wait for its delivery", turn_limited=False)
WORKER_LOG_DUE = NudgeDeclaration("workers.worker_log_due", NudgeType.INSTRUCTION, 'you logged nothing for {minutes} min: log where you stand with journal proof make <point> "<proof>"', interval=Interval(Seconds(1800)), turn_limited=False, required_command="")

WORKER_TESTS_PASSED = NudgeDeclaration("workers.tests_passed", NudgeType.INSTRUCTION, 'the tests of worker:{worker} all pass: journal worker merge {worker}', turn_limited=False)
WORKER_TESTS_FAILED = NudgeDeclaration("workers.tests_failed", NudgeType.INSTRUCTION, 'your tests failed: {lines}. Fix them, then journal worker next, or journal worker deliver on your last task', turn_limited=False)
WORKER_UNFINISHED_TASKS = NudgeDeclaration("workers.unfinished_tasks", NudgeType.INSTRUCTION, 'you ended with tasks left: go on with journal worker next, deliver after the last, and stop only then')
WORKER_COMMENT_COPY = NudgeDeclaration("workers.comment_copy", NudgeType.INSTRUCTION, 'worker:{worker} was also told message:{message}: act on it yourself, or leave it to the worker', turn_limited=False)
WORKER_TASK_COMMENT = NudgeDeclaration("workers.task_comment", NudgeType.INSTRUCTION, 'the user commented: {job}', turn_limited=False)
WORKER_NEXT_TASK = NudgeDeclaration("workers.next_task", NudgeType.INSTRUCTION, 'your tests passed. Your next task, task:{task}: {job}', turn_limited=False)
WORKER_REPORT = NudgeDeclaration("workers.report", NudgeType.INSTRUCTION, 'worker:{worker} reports: {job}', turn_limited=False)
WORKER_REUSE = NudgeDeclaration("workers.reuse", NudgeType.REFUSAL, 'worker:{worker} changed these files: journal worker send {worker} "<job>", or add --fresh if it needs a new one', turn_limited=False)
WORKER_NUDGES = [WORKER_REUSE, WORKER_REPORT, WORKER_NEXT_TASK, WORKER_COMMENT_COPY, WORKER_TASK_COMMENT, WORKER_UNFINISHED_TASKS, WORKER_TESTS_PASSED, WORKER_TESTS_FAILED, WORKER_FILE, WORKER_LOG_DUE, HELPER_INACTIVE, WORKER_UNMERGED, SMALL_BATCH, WORKER_RETIRED, BUILDER_BUILDS, PROOF_CHECK, MERGE_WAITS, WORKER_TASK]
