from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

HELPER_INACTIVE = NudgeDeclaration("workers.helper_inactive", NudgeType.STEERING, '{name}:{agent} has used no tool for {minutes} minutes{queue}: {action}', turn_limited=False, longest_characters=300, field_limit_characters=200)
BUILDER_BUILDS = NudgeDeclaration("workers.builder_builds", NudgeType.REFUSAL, 'this builder builds its tasks itself: coding.builder-dispatches-workers is false')
PROOF_CHECK = NudgeDeclaration("workers.check_the_proof", NudgeType.REFUSAL, 'worker:{worker} delivered task:{task}: journal proof check {proofs}, or journal proof short <proof> "<what is missing>"')
PROOF_WAITS = NudgeDeclaration("workers.proof_waits", NudgeType.STEERING, 'worker:{worker} waits on your check: journal proof check {proofs}, or journal proof short <proof> "<why>"', turn_limited=False, wakes_agent=True)
MERGE_WAITS = NudgeDeclaration("workers.merge_waits", NudgeType.STEERING, 'the merge of worker {worker} waits for the checkout of environment {environment} to return to {branch}', turn_limited=False)
WORKER_TASK = NudgeDeclaration("workers.worker_holds_task", NudgeType.STEERING, 'worker:{worker} holds task:{task}: its worktree is {state}')

WORKER_UNMERGED = NudgeDeclaration("workers.worker_unmerged", NudgeType.STEERING, 'worker:{worker} delivered {tasks}, unmerged: {action}', interval=Interval(Seconds(600)), turn_limited=False)

WORKER_LIMIT_RAISED = NudgeDeclaration("workers.limit_raised", NudgeType.STEERING, 'worker limit is now {limit}: {workers} workers out, {count} open tasks not delegated; hand out more', turn_limited=False)

SMALL_BATCH =NudgeDeclaration("workers.small_batch", NudgeType.STEERING, 'batch of {count}: queue more tasks on a worker, a long batch runs on and bothers you less', turn_limited=False)

WORKER_RETIRED = NudgeDeclaration("workers.worker_retired", NudgeType.STEERING, 'worker:{worker} was idle too long: released, task:{task} is open again', turn_limited=False)

WORKER_JUDGE_SCOPE = NudgeDeclaration("workers.judge_scope", NudgeType.REFUSAL, 'a worker judges only its own changes: journal sins --changes or journal sins --branch', turn_limited=False)
WORKER_FILE = NudgeDeclaration("workers.file_is_the_workers", NudgeType.REFUSAL, "that file is in worker {worker}'s worktree: journal worker send {worker} \"<job>\", or wait for its delivery", turn_limited=False)
WORKER_LOG_DUE = NudgeDeclaration("workers.worker_log_due", NudgeType.STEERING, 'you logged nothing for {minutes} min: log where you stand with journal proof make <point> "<proof>"', interval=Interval(Seconds(1800)), turn_limited=False, required_command="")

WORKER_TESTS_PASSED = NudgeDeclaration("workers.tests_passed", NudgeType.STEERING, 'the tests of worker:{worker} all pass: journal worker merge {worker}', turn_limited=False, required_command="")
WORKER_TESTS_FAILED = NudgeDeclaration("workers.tests_failed", NudgeType.STEERING, 'your tests failed: journal output read {outputs} --summary. Fix them, then journal worker next or deliver', turn_limited=False, required_command="")
READER_SAMPLE_READY = NudgeDeclaration("workers.reader_sample_ready", NudgeType.STEERING, "read the sample: journal output read {output} --reader {reader}", wakes_agent=True)
WORKER_RUN_ENDED = NudgeDeclaration("workers.run_ended", NudgeType.STEERING, 'your run {output} ended: journal output read {output} --summary, then go on', required_command="")
WORKER_UNFINISHED_TASKS = NudgeDeclaration("workers.unfinished_tasks", NudgeType.STEERING, 'you ended with tasks left: go on with journal worker next, deliver after the last, and stop only then', required_command="")
WORKER_COMMENT_COPY = NudgeDeclaration("workers.comment_copy", NudgeType.STEERING, 'worker:{worker} was also told message:{message}: act on it yourself, or leave it to the worker', turn_limited=False, wakes_agent=True)
WORKER_TASK_COMMENT = NudgeDeclaration("workers.task_comment", NudgeType.STEERING, 'the user commented on task:{task}: journal task comments {task}', turn_limited=False, required_command="")
WORKER_NEXT_TASK = NudgeDeclaration("workers.next_task", NudgeType.STEERING, 'your tests passed. Your next task is task:{task}: journal task show {task}', turn_limited=False, required_command="")
WORKER_TASK_REASSIGNED = NudgeDeclaration("workers.task_taken", NudgeType.STEERING, 'task:{task} was taken from you: leave it', turn_limited=False)
WORKER_TASK_AFTER_REASSIGNED = NudgeDeclaration("workers.task_after_taken", NudgeType.STEERING, 'your next task is task:{task}: journal task show {task}', turn_limited=False, required_command="")
WORKER_REPORT = NudgeDeclaration("workers.report", NudgeType.STEERING, 'worker:{worker} reports in message:{message}: journal message read {message}', turn_limited=False, required_command="", wakes_agent=True)
WORKER_REUSE = NudgeDeclaration("workers.reuse", NudgeType.REFUSAL, 'worker:{worker} changed these files: journal worker send {worker} "<job>", or add --fresh if it needs a new one', turn_limited=False)
WORKER_ENDED_WITH_TASKS = NudgeDeclaration("workers.ended_with_tasks", NudgeType.STEERING, 'worker:{worker} ended with {tasks} left: journal worker send {worker} "<job>", or journal worker release {worker}', turn_limited=False, wakes_agent=True)
WORKER_MERGE_CONFLICT = NudgeDeclaration("workers.merge_clash", NudgeType.STEERING, '{branch} is merged into your worktree and clashes on {lines}: settle the markers there, then journal worker deliver', turn_limited=False)
WORKER_PROOF_SHORT = NudgeDeclaration("workers.proof_short", NudgeType.STEERING, 'proof:{proof} of task:{task} is short: read journal proof show {proof}, fix it, then journal worker deliver', turn_limited=False)
WORKER_TASK_BLOCKED = NudgeDeclaration("workers.task_blocked", NudgeType.STEERING, 'worker:{worker} blocked task:{task}: journal task show {task}', turn_limited=False)

WORKER_REFUSAL_INTERVAL = Interval(Seconds(600))
WORKER_REFUSED = NudgeDeclaration("workers.repeated_refusal", NudgeType.STEERING, 'worker:{worker} refused {count} times on task:{task}: {refusal}: journal worker send {worker} "<job>"', interval=WORKER_REFUSAL_INTERVAL, turn_limited=False, longest_characters=800, field_limit_characters=600)

WORKER_RESTARTED = NudgeDeclaration("workers.restarted", NudgeType.STEERING, "worker:{worker} stopped with {tasks} left and is started again", turn_limited=False)
WORKER_HELP_REQUEST = NudgeDeclaration("workers.help-request", NudgeType.STEERING, 'worker:{worker} is stuck on {tasks}, wait:{wait}: journal worker send {worker} "<job>"', turn_limited=False, wakes_agent=True)
WORKER_NUDGES = [READER_SAMPLE_READY, WORKER_RESTARTED, WORKER_HELP_REQUEST, WORKER_REFUSED, WORKER_TASK_BLOCKED, WORKER_LIMIT_RAISED, WORKER_MERGE_CONFLICT, WORKER_PROOF_SHORT, WORKER_ENDED_WITH_TASKS, WORKER_REUSE, WORKER_REPORT, WORKER_NEXT_TASK, WORKER_TASK_REASSIGNED, WORKER_TASK_AFTER_REASSIGNED, WORKER_JUDGE_SCOPE, WORKER_COMMENT_COPY, WORKER_TASK_COMMENT, WORKER_UNFINISHED_TASKS, WORKER_TESTS_PASSED, WORKER_TESTS_FAILED, WORKER_FILE, WORKER_LOG_DUE, HELPER_INACTIVE, WORKER_UNMERGED, SMALL_BATCH, WORKER_RETIRED, BUILDER_BUILDS, PROOF_CHECK, PROOF_WAITS, MERGE_WAITS, WORKER_TASK, WORKER_RUN_ENDED]
