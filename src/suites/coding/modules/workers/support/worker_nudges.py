from suites.coding.modules.workers.models.enums.worker_operation_name import (WORKER_OPERATION_NEXT, WORKER_OPERATION_TESTS, WORKER_OPERATION_CONFLICT, WORKER_OPERATION_MERGED, WORKER_OPERATION_JOB, WORKER_OPERATION_DELIVERED)
from dataclasses import replace
from suites.coding.modules.workers.commands.report_worker_program_recovery.report_worker_program_recovery import WORKER_PROGRAM_UNAVAILABLE, WORKER_PROGRAM_RESUMED
from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

APPROVED_PLAN_WAIT = NudgeDeclaration("workers.approved_plan_wait", NudgeType.REFUSAL, 'plan:{plan} is approved and a worker place is free: start it, then assign its work')

HELPER_INACTIVE = NudgeDeclaration("workers.helper_inactive", NudgeType.STEERING, '{name}:{agent} has used no tool for {minutes} minutes{queue}: {action}', turn_limited=False, wakes_agent=True)
MAIN_SENDS_NO_WORKERS = NudgeDeclaration("workers.main_sends_no_workers", NudgeType.REFUSAL, 'the main agent sends no workers here: {then}')
PROOF_CHECK = NudgeDeclaration("workers.check_the_proof", NudgeType.REFUSAL, 'worker:{worker} delivered task:{task}, proofs {proofs}')
WORKER_UNSTARTED = NudgeDeclaration("workers.unstarted", NudgeType.STEERING, 'worker:{worker} made no call in {seconds} seconds', interval=Interval(Seconds(600)), turn_limited=False, wakes_agent=True,
                                   plural_text='workers {worker} made no call in {seconds} seconds', id_field="worker")
PROOF_WAITS = NudgeDeclaration("workers.proof_waits", NudgeType.STEERING, 'worker:{worker} waits on your check, proofs {proofs}', turn_limited=False, wakes_agent=True)
MERGE_WAITS = NudgeDeclaration("workers.merge_waits", NudgeType.STEERING, 'the merge of worker {worker} waits for the checkout of environment {environment} to return to {branch}', turn_limited=False,
                              plural_text='the merges of workers {worker} wait for the checkout of environment {environment} to return to {branch}', id_field="worker")
WORKER_TASK = NudgeDeclaration("workers.worker_holds_task", NudgeType.STEERING, 'worker:{worker} has task:{task}')

WORKER_UNMERGED = NudgeDeclaration("workers.worker_unmerged", NudgeType.STEERING, 'worker:{worker} delivered {tasks}, unmerged: {action}', interval=Interval(Seconds(300)), turn_limited=False, wakes_agent=True,
                                  plural_text='workers {worker} delivered {tasks}, unmerged: {action}', id_field="worker")
WORKER_UNMERGED_DUE = NudgeDeclaration("workers.worker_unmerged_due", NudgeType.STEERING, 'worker:{worker} delivered {tasks}, unmerged: {action}', interval=Interval(Seconds(300)), turn_limited=False, wakes_agent=True, required_command="journal worker merge {worker}")

WORKER_LIMIT_RAISED = NudgeDeclaration("workers.limit_raised", NudgeType.STEERING, 'worker limit is now {limit}: {workers} workers out, {count} open tasks not delegated; hand out more', turn_limited=False)

SMALL_BATCH =NudgeDeclaration("workers.small_batch", NudgeType.STEERING, 'batch of {count}: queue more tasks on a worker, a long batch runs on and interrupts you less', turn_limited=False)

WORKER_IDLE_STOPPED = NudgeDeclaration("workers.worker_idle_stopped", NudgeType.STEERING, 'worker:{worker} was idle too long: its process stopped, task:{task} stays with it', turn_limited=False)

WORKER_JUDGE_SCOPE = NudgeDeclaration("workers.judge_scope", NudgeType.REFUSAL, 'a worker judges only its own changes or its branch', turn_limited=False)
WORKER_FILE = NudgeDeclaration("workers.file_is_the_workers", NudgeType.REFUSAL, "that file is in worker {worker}'s worktree: send the worker a job, or wait for its delivery", turn_limited=False)
WORKER_LOG_DUE = NudgeDeclaration("workers.worker_log_due", NudgeType.STEERING, 'you logged nothing for {minutes} min: log where you stand', interval=Interval(Seconds(1800)), turn_limited=False)

WORKER_TESTS_PASSED = NudgeDeclaration("workers.tests_passed", NudgeType.STEERING, 'the tests of worker:{worker} all pass', turn_limited=False,
                                     plural_text='the tests of workers {worker} all pass', id_field="worker")
WORKER_TESTS_FAILED = NudgeDeclaration("workers.tests_failed", NudgeType.STEERING, 'your tests failed, output {outputs}: fix them, then hand in again', turn_limited=False)
WORKER_PHASE_TESTS_FAILED = NudgeDeclaration("workers.phase_tests_failed", NudgeType.STEERING, 'phase:{phase} tests failed, output {outputs}: fix them, then hand in again', turn_limited=False, id_field="outputs")
WORKER_TEST_REQUESTED = NudgeDeclaration("workers.test_requested", NudgeType.STEERING, 'worker:{worker} asks to run a command for task:{task}, request:{request}', turn_limited=False, wakes_agent=True, id_field="request", plural_text="worker:{worker} asks for task:{task}, requests {request}")
WORKER_TEST_ALLOWED = NudgeDeclaration("workers.test_allowed", NudgeType.STEERING, 'request {request} is allowed: run it once without the flag', turn_limited=False, wakes_agent=True, id_field="request", plural_text="requests {request} are allowed: run each once")
TEST_REQUEST_FORWARDED = NudgeDeclaration("workers.test_request_sent", NudgeType.SAFETY_REFUSAL, 'your request went to your main agent: go on working, you hear when it is allowed', turn_limited=False)
TEST_REQUEST_WAITING = NudgeDeclaration("workers.test_request_waiting", NudgeType.SAFETY_REFUSAL, 'request {request} is with your main agent: go on working, you hear when it is allowed', turn_limited=False)
TEST_REQUEST_ALLOWED = NudgeDeclaration("workers.test_request_allowed", NudgeType.SAFETY_REFUSAL, 'request {request} is allowed: run this command once, without the flag', turn_limited=False)
TEST_REQUEST_REASON_MISSING = NudgeDeclaration("workers.test_request_no_reason", NudgeType.SAFETY_REFUSAL, 'the flag needs a reason: run it again with --ask-main "<why>"', turn_limited=False)
TEST_REQUEST_UNNEEDED = NudgeDeclaration("workers.test_needs_no_request", NudgeType.SAFETY_REFUSAL, 'you need not ask: run the command without the flag', turn_limited=False)
PHASE_TEST_RUN_ALLOWED = NudgeDeclaration("workers.phase_test_run_allowed", NudgeType.STEERING, "Test runs left: {remaining}. Proof tests run at hand-in. Run tests only when needed.", turn_limited=False)
PHASE_TEST_REFUSED = NudgeDeclaration("workers.phase_test_refused", NudgeType.SAFETY_REFUSAL, 'The journal runs proof tests at hand-in and returns failures. No runs left; only if needed, --ask-main "<why>".', turn_limited=False)
WORKER_RUN_ENDED = NudgeDeclaration("workers.run_ended", NudgeType.STEERING, 'your run {output} ended: read it, then go on',
                                   plural_text='your runs {output} ended: read each, then go on', id_field="output")
WORKER_UNFINISHED_TASKS = NudgeDeclaration("workers.unfinished_tasks", NudgeType.STEERING, 'you ended with tasks left: go on with the next one, deliver after the last, and stop only then')
READER_SAMPLE_READY = NudgeDeclaration("workers.reader_sample_ready", NudgeType.STEERING, "read the sample of output {output} with reader {reader}", wakes_agent=True)
WORKER_COMMENT_COPY = NudgeDeclaration("workers.comment_copy", NudgeType.STEERING, 'worker:{worker} was also told message:{message}: act on it yourself, or leave it to the worker', turn_limited=False, wakes_agent=True)
WORKER_TASK_COMMENT = NudgeDeclaration("workers.task_comment", NudgeType.STEERING, 'the user commented on task:{task}', turn_limited=False,
                                      plural_text='the user commented on tasks {task}', id_field="task")
WORKER_NEXT_TASK = NudgeDeclaration("workers.next_task", NudgeType.STEERING, 'your tests passed. Your next task is task:{task}', turn_limited=False)
WORKER_TASK_REASSIGNED = NudgeDeclaration("workers.task_taken", NudgeType.STEERING, 'task:{task} was taken from you: leave it', turn_limited=False)
WORKER_TASK_AFTER_REASSIGNED = NudgeDeclaration("workers.task_after_taken", NudgeType.STEERING, 'your next task is task:{task}', turn_limited=False)
WORKER_REUSE = NudgeDeclaration("workers.reuse", NudgeType.REFUSAL, 'worker:{worker} changed these files: send it the job, or name a reason for a new worker', turn_limited=False)
WORKER_ENDED_WITH_TASKS = NudgeDeclaration("workers.ended_with_tasks", NudgeType.STEERING, 'worker:{worker} ended with {tasks} left: send it a job, or release it', turn_limited=False, wakes_agent=True)
WORKER_MERGE_CONFLICT = NudgeDeclaration("workers.merge_clash", NudgeType.STEERING, '{branch} is merged into your worktree and clashes on {lines}: settle the markers there, then deliver', turn_limited=False, path_fields=["lines"])
WORKER_PROOF_SHORT = NudgeDeclaration("workers.proof_short", NudgeType.STEERING, 'proof:{proof} of task:{task} is short: read it, fix it, then deliver', turn_limited=False)
WORKER_TASK_BLOCKED = NudgeDeclaration("workers.task_blocked", NudgeType.STEERING, 'worker:{worker} blocked task:{task}', turn_limited=False)

WORKER_REFUSAL_INTERVAL = Interval(Seconds(600))
WORKER_REFUSED = NudgeDeclaration("workers.repeated_refusal", NudgeType.STEERING, 'worker:{worker} refused {count} times on task:{task}', interval=WORKER_REFUSAL_INTERVAL, turn_limited=False)

WORKER_RUN_RUNS_AFTER_STOP = NudgeDeclaration("workers.run_outlasts", NudgeType.STEERING, "worker:{worker} stopped and waits on output {output}, still running: stop that output", interval=Interval(Seconds(600)), turn_limited=False, wakes_agent=True)
WORKER_RESTARTED = NudgeDeclaration("workers.restarted", NudgeType.STEERING, "worker:{worker} stopped with {tasks} left and is started again", turn_limited=False)
WORKER_HELP_REQUEST = NudgeDeclaration("workers.help-request", NudgeType.STEERING, 'worker:{worker} is stuck on {tasks}, wait:{wait}: send it a job', turn_limited=False, wakes_agent=True)
WORKER_STATUS_FIRST = NudgeDeclaration("workers.status_first", NudgeType.REFUSAL, "after a compaction, read your worker status first")

SILENT_AGENT_CONTINUE = NudgeDeclaration("workers.continue_silent_agent", NudgeType.STEERING, "Go on with your unfinished work.", turn_limited=False, wakes_agent=True, repeats_without_hook=True)
SILENT_WORKER_CONTINUE = replace(SILENT_AGENT_CONTINUE, key="workers.continue_silent_worker", wakes_agent=False)

WORKER_READ_REFUSAL = NudgeDeclaration("workers.read_outside_worktree", NudgeType.REFUSAL, "that file is outside your worktree: read what is in it, or ask in your report")
UNSTARTED_JOB = NudgeDeclaration("workers.job_not_started", NudgeType.STEERING, '{name}:{agent} has had work waiting for {minutes} minutes and has not started: {action}', turn_limited=False, wakes_agent=True)

IDLE_WORKER = NudgeDeclaration("workers.idle_worker", NudgeType.STEERING, "worker:{worker} has stopped", turn_limited=False)

WORKER_OPERATION_FAILED = NudgeDeclaration("workers.operation_failed", NudgeType.STEERING,
    'worker command failed: output {output}', turn_limited=False, wakes_agent=True)

WORKER_ROUTE_FALLBACK = NudgeDeclaration("workers.route_fallback", NudgeType.STEERING, "route {route}: {tasks} went to {program}", turn_limited=False)

WORKER_NUDGES = [WORKER_OPERATION_NEXT, WORKER_OPERATION_TESTS, WORKER_OPERATION_CONFLICT, WORKER_OPERATION_MERGED, WORKER_OPERATION_JOB, WORKER_OPERATION_DELIVERED, WORKER_OPERATION_FAILED, WORKER_ROUTE_FALLBACK, WORKER_PROGRAM_UNAVAILABLE, WORKER_PROGRAM_RESUMED, IDLE_WORKER, UNSTARTED_JOB, WORKER_UNMERGED_DUE, WORKER_READ_REFUSAL, SILENT_AGENT_CONTINUE, SILENT_WORKER_CONTINUE, WORKER_STATUS_FIRST, WORKER_UNSTARTED, READER_SAMPLE_READY, WORKER_RUN_RUNS_AFTER_STOP, WORKER_RESTARTED, WORKER_HELP_REQUEST, WORKER_REFUSED, WORKER_TASK_BLOCKED, WORKER_LIMIT_RAISED, WORKER_MERGE_CONFLICT, WORKER_PROOF_SHORT, WORKER_ENDED_WITH_TASKS, WORKER_REUSE, WORKER_NEXT_TASK, WORKER_TASK_REASSIGNED, WORKER_TASK_AFTER_REASSIGNED, WORKER_JUDGE_SCOPE, WORKER_COMMENT_COPY, WORKER_TASK_COMMENT, WORKER_UNFINISHED_TASKS, WORKER_TESTS_PASSED, WORKER_TESTS_FAILED, WORKER_PHASE_TESTS_FAILED, WORKER_TEST_REQUESTED, WORKER_TEST_ALLOWED, PHASE_TEST_RUN_ALLOWED, PHASE_TEST_REFUSED, TEST_REQUEST_FORWARDED, TEST_REQUEST_WAITING, TEST_REQUEST_ALLOWED, TEST_REQUEST_REASON_MISSING, TEST_REQUEST_UNNEEDED, WORKER_FILE, WORKER_LOG_DUE, HELPER_INACTIVE, WORKER_UNMERGED, SMALL_BATCH, WORKER_IDLE_STOPPED, MAIN_SENDS_NO_WORKERS, PROOF_CHECK, PROOF_WAITS, MERGE_WAITS, WORKER_TASK, WORKER_RUN_ENDED]
