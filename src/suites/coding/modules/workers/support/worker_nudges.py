from suites.coding.modules.workers.models.enums.worker_operation_name import (WORKER_OPERATION_NEXT, WORKER_OPERATION_TESTS, WORKER_OPERATION_CONFLICT, WORKER_OPERATION_MERGED, WORKER_OPERATION_JOB, WORKER_OPERATION_PAUSED, WORKER_OPERATION_COMMITTED, WORKER_OPERATION_STARTED, WORKER_OPERATION_UPDATED, WORKER_OPERATION_UPDATE_CONFLICT, WORKER_OPERATION_UPDATE_FAILED)
from dataclasses import replace
from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.modules.workers.commands.send_unfinished_tasks_line.send_unfinished_tasks_line import WORKER_UNFINISHED_TASKS
from suites.coding.modules.workers.commands.report_worker_program_recovery.report_worker_program_recovery import WORKER_PROGRAM_UNAVAILABLE, WORKER_PROGRAM_RESUMED
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

APPROVED_PLAN_WAIT = NudgeDeclaration("workers.approved_plan_wait", NudgeType.REFUSAL, "plan:{plan} is approved and a worker slot is free: start a worker, then assign its work")

HELPER_INACTIVE = NudgeDeclaration("workers.helper_inactive", NudgeType.STEERING, "{name}:{agent} used no tool for {minutes} min{queue}: {action}", turn_limited=False, wakes_agent=True)
MAIN_WORKERS_REFUSED = NudgeDeclaration("workers.main_sends_no_workers", NudgeType.REFUSAL, "The main agent sends no workers here: {then}")
PROOF_CHECK = NudgeDeclaration("workers.check_the_proof", NudgeType.REFUSAL, "worker:{worker} committed task:{task}, proofs {proofs}: check them")
WORKER_UNSTARTED = NudgeDeclaration("workers.unstarted", NudgeType.STEERING, "worker:{worker} made no call in {seconds}s", interval=Interval(Seconds(600)), turn_limited=False, wakes_agent=True,
                                   plural_text='workers {worker} made no call in {seconds} seconds', id_field="worker")
PROOF_RUN_STUCK = NudgeDeclaration("workers.proof_run_stuck", NudgeType.STEERING, 'worker:{worker} proof {proof}: the test run went past {minutes} minutes and was ended as stuck, output {output}', turn_limited=False, wakes_agent=True)
PROOF_WAITS = NudgeDeclaration("workers.proof_waits", NudgeType.STEERING, 'worker:{worker} waits on your check, proofs {proofs}', turn_limited=False, wakes_agent=True)
MERGE_WAITS = NudgeDeclaration("workers.merge_waits", NudgeType.STEERING, "The merge of worker {worker} waits for environment {environment} to check out {branch} again", turn_limited=False,
                              plural_text='The merges of workers {worker} wait for environment {environment} to check out {branch} again', id_field="worker")
WORKER_TASK = NudgeDeclaration("workers.worker_holds_task", NudgeType.STEERING, 'worker:{worker} has task:{task}')

WORKER_UNMERGED = NudgeDeclaration("workers.worker_unmerged", NudgeType.STEERING, "worker:{worker} committed {tasks}, not merged: {action}", interval=Interval(Seconds(300)), turn_limited=False, wakes_agent=True,
                                  plural_text='workers {worker} committed {tasks}, unmerged: {action}', id_field="worker")
WORKER_UNMERGED_DUE = NudgeDeclaration("workers.worker_unmerged_due", NudgeType.STEERING, "worker:{worker} committed {tasks}, not merged: {action}", interval=Interval(Seconds(300)), turn_limited=False, wakes_agent=True, required_command="journal worker merge {worker}")

WORKER_LIMIT_RAISED = NudgeDeclaration("workers.limit_raised", NudgeType.STEERING, "Worker limit is now {limit}: {workers} out, {count} open tasks not delegated: hand out more", turn_limited=False)

SMALL_BATCH =NudgeDeclaration("workers.small_batch", NudgeType.STEERING, "Batch of {count}: queue more tasks per worker; a long batch interrupts you less", turn_limited=False)

WORKER_IDLE_STOPPED = NudgeDeclaration("workers.worker_idle_stopped", NudgeType.STEERING, "worker:{worker} was idle too long and its process stopped; task:{task} stays with it", turn_limited=False)

WORKER_JUDGE_SCOPE = NudgeDeclaration("workers.judge_scope", NudgeType.REFUSAL, "A worker judges only its own changes or its branch", turn_limited=False)
WORKER_FOREIGN_LINK = NudgeDeclaration("workers.outside_link", NudgeType.REFUSAL, "Links from outside your worktree are refused: report what is missing to your main agent", turn_limited=False)
WORKER_FILE = NudgeDeclaration("workers.file_is_the_workers", NudgeType.REFUSAL, "That file is in worker {worker}'s worktree: send the worker a job, or wait for its delivery", turn_limited=False)
PROTECTED_FOLDER = NudgeDeclaration("workers.protected_folder", NudgeType.REFUSAL, "{folder} is protected: report the change to the main agent", turn_limited=False)
WORKER_LOG_DUE = NudgeDeclaration("workers.worker_log_due", NudgeType.STEERING, "Nothing logged for {minutes} min: log where you stand", interval=Interval(Seconds(1800)), turn_limited=False)

WORKER_TESTS_PASSED = NudgeDeclaration("workers.tests_passed", NudgeType.STEERING, "All tests of worker:{worker} pass", turn_limited=False,
                                     plural_text='the tests of workers {worker} all pass', id_field="worker")
WORKER_COMMITTED = NudgeDeclaration("workers.committed", NudgeType.STEERING, "The work of worker:{worker} is committed and ready to merge", turn_limited=False,
                                  plural_text='the work of workers {worker} is committed and can be merged', id_field="worker")
WORKER_TESTS_FAILED = NudgeDeclaration("workers.tests_failed", NudgeType.STEERING, "Your tests failed, output {outputs}: {line}", turn_limited=False, path_fields=["line"])
WORKER_PHASE_TESTS_FAILED = NudgeDeclaration("workers.phase_tests_failed", NudgeType.STEERING, 'phase:{phase} tests failed, output {outputs}: {line}', turn_limited=False, id_field="outputs", path_fields=["line"])
WORKER_LIBRARIES_LINKED = NudgeDeclaration("workers.libraries_linked", NudgeType.STEERING, "Your worktree's libraries are linked: rerun your tests", turn_limited=False, wakes_agent=True)
PHASE_TEST_RUN_ALLOWED = NudgeDeclaration("workers.phase_test_run_allowed", NudgeType.STEERING, "The journal tests your commit itself. Test runs left before your next commit: {remaining}", turn_limited=False)
WORKER_TEST_LINE_REFUSED = NudgeDeclaration("workers.named_tests_only", NudgeType.SAFETY_REFUSAL, "A test runs only through your test commands. Yours: {names}. " + AskTopic.TESTS.question_line(), turn_limited=False, full_text=True)
WORKER_TEST_COMMANDS_MISSING = NudgeDeclaration("workers.no_test_commands", NudgeType.SAFETY_REFUSAL, "You have no test commands, so no test can run for you. Only the main agent gives them: journal worker send {worker} --test-command <name>=<command>. " + AskTopic.TESTS.question_line(), turn_limited=False, full_text=True)
PHASE_TEST_REFUSED =NudgeDeclaration("workers.phase_test_refused", NudgeType.SAFETY_REFUSAL, 'No test runs left before your next commit: commit and go on. ' + AskTopic.TESTS.question_line(), turn_limited=False, full_text=True)
WORKER_RUN_ENDED = NudgeDeclaration("workers.run_ended", NudgeType.STEERING, "Your run {output} ended: read it, then continue",
                                   plural_text='your runs {output} ended: read each, then go on', id_field="output")
READER_SAMPLE_READY = NudgeDeclaration("workers.reader_sample_ready", NudgeType.STEERING, "Read the sample of output {output} with reader {reader}", wakes_agent=True)
WORKER_COMMENT_COPY = NudgeDeclaration("workers.comment_copy", NudgeType.STEERING, "worker:{worker} also got message:{message}: act on it yourself, or leave it to the worker", turn_limited=False, wakes_agent=True)
WORKER_TASK_COMMENT = NudgeDeclaration("workers.task_comment", NudgeType.STEERING, "The user commented on task:{task}: read it", turn_limited=False,
                                      plural_text='the user commented on tasks {task}', id_field="task")
WORKER_NEXT_TASK = NudgeDeclaration("workers.next_task", NudgeType.STEERING, "Your tests passed. Next: task:{task}. {line}", turn_limited=False, path_fields=["line"])
WORKER_TASK_REASSIGNED = NudgeDeclaration("workers.task_taken", NudgeType.STEERING, 'task:{task} was taken from you: leave it', turn_limited=False)
WORKER_TASK_AFTER_REASSIGNED = NudgeDeclaration("workers.task_after_taken", NudgeType.STEERING, "Your next task is task:{task}", turn_limited=False)
WORKER_REUSE = NudgeDeclaration("workers.reuse", NudgeType.REFUSAL, "worker:{worker} changed these files: send it the job, or give a reason for a new worker", turn_limited=False)
WORKER_RETIRED_WITH_TASKS = NudgeDeclaration("workers.retired_with_tasks", NudgeType.STEERING, 'worker:{worker} was retired with {tasks} left: give them to another worker', turn_limited=False, wakes_agent=True)
WORKER_ENDED_WITH_TASKS = NudgeDeclaration("workers.ended_with_tasks", NudgeType.STEERING, "worker:{worker} ended with {tasks} left: send it a job, or release them", turn_limited=False, wakes_agent=True)
WORKER_COMMITTED_UNMERGED = NudgeDeclaration("workers.committed_unmerged", NudgeType.STEERING, "{tasks} of worker:{worker} are committed but not merged", turn_limited=False)
CHECKPOINT_FAILURE_FALLBACK = NudgeDeclaration("workers.checkpoint_failure_fallback", NudgeType.STEERING,
                                             "A failed test of checkpoint phase:{phase} names no task: task:{task} was sent back, output {outputs}", turn_limited=False)
WORKER_TASK_AWAITED = NudgeDeclaration("workers.committed_task_awaited", NudgeType.STEERING, "worker:{worker} waits on your committed task:{task}; to share it early, ask with --up-to {task}",
                                      turn_limited=False, id_field="task")
WORKER_TASK_JOINS = NudgeDeclaration("workers.task_joins_unit", NudgeType.STEERING, "task:{task} joins your unit; to merge it early, commit it and ask with --up-to {task}",
                                    turn_limited=False, id_field="task")
WORKER_UNIT_RUN_PASSED = NudgeDeclaration("workers.unit_run_passed", NudgeType.STEERING, 'phase:{phase} tests passed on your commit: {line}',
                                         turn_limited=False, wakes_agent=True, path_fields=["line"])
WORKER_RUN_UNSTARTED = NudgeDeclaration("workers.worker_run_unstarted", NudgeType.STEERING, "phase:{phase} tests could not start on your commit; nothing failed: continue, your next commit starts them",
                                       turn_limited=False)
MERGER_WORKER_RUN_UNSTARTED = NudgeDeclaration("workers.merger_worker_run_unstarted", NudgeType.STEERING,
                                              "Checkpoint phase:{phase} tests could not start on a commit of worker:{worker}", turn_limited=False)
WORKER_MERGE_CONFLICT = NudgeDeclaration("workers.merge_clash", NudgeType.STEERING, "{branch} merged into your worktree and clashes on {lines}: {line}", turn_limited=False, path_fields=["lines", "line"])
WORKER_TASK_COUNT = NudgeDeclaration("workers.started_task_count", NudgeType.STEERING, "You hold {count} of the {limit} tasks you may hold at once", turn_limited=False)
WORKER_COMMIT_PASSED = NudgeDeclaration("workers.commit_tests_passed", NudgeType.STEERING, "Your commit's tests passed: {line}", turn_limited=False, path_fields=["line"])
WORKER_PROOF_SHORT = NudgeDeclaration("workers.proof_short", NudgeType.STEERING, "proof:{proof} of task:{task} is too short: read it, fix it, show it again and commit", turn_limited=False)
WORKER_ASKING_STOPPED = NudgeDeclaration("workers.asking_stopped", NudgeType.STEERING, "worker:{worker} is stopped and will not restart: its question is unanswered, {tasks}", interval=Interval(Seconds(1800)), turn_limited=False, wakes_agent=True)
WORKER_PROCESS_ENDED = NudgeDeclaration("workers.process_ended", NudgeType.STEERING, "worker:{worker} is stopped and will not restart: its process ended, {tasks}", interval=Interval(Seconds(300)), turn_limited=False, wakes_agent=True)
WORKER_LIMIT_STOPPED = NudgeDeclaration("workers.limit_stopped", NudgeType.STEERING, "worker:{worker} is stopped and will not restart: it kept stopping, {tasks}", interval=Interval(Seconds(1800)), turn_limited=False, wakes_agent=True)
WORKER_TASK_BLOCKED = NudgeDeclaration("workers.task_blocked", NudgeType.STEERING, "worker:{worker} blocked task:{task}: only you or a user can unblock it", turn_limited=False, wakes_agent=True)
BLOCKED_WORKER_TASK = NudgeDeclaration("workers.own_task_blocked", NudgeType.STEERING, 'task:{task} was blocked', turn_limited=False)

WORKER_REFUSAL_INTERVAL = Interval(Seconds(600))
WORKER_REFUSED = NudgeDeclaration("workers.repeated_refusal", NudgeType.STEERING, "worker:{worker} hit {count} refusals on task:{task}: check what is blocking it", interval=WORKER_REFUSAL_INTERVAL, turn_limited=False)

WORKER_RUN_RUNS_AFTER_STOP = NudgeDeclaration("workers.run_outlasts", NudgeType.STEERING, "worker:{worker} stopped but output {output} is still running: stop that output", interval=Interval(Seconds(600)), turn_limited=False, wakes_agent=True)
WORKER_RESTARTED = NudgeDeclaration("workers.restarted", NudgeType.STEERING, "worker:{worker} stopped with {tasks} left and was started again", turn_limited=False)
WORKER_LAUNCH_FAILED = NudgeDeclaration("workers.launch_failed", NudgeType.STEERING, "worker:{worker} failed to start: {line}", turn_limited=False)
WORKER_HELP_REQUEST = NudgeDeclaration("workers.help-request", NudgeType.STEERING, 'worker:{worker} is stuck on {tasks}, wait:{wait}: send it a job', turn_limited=False, wakes_agent=True)
WORKER_STATUS_FIRST = NudgeDeclaration("workers.status_first", NudgeType.REFUSAL, "After a compaction, read your worker status first")

SILENT_AGENT_CONTINUE = NudgeDeclaration("workers.continue_silent_agent", NudgeType.STEERING, "Continue your unfinished work.", turn_limited=False, wakes_agent=True, repeats_without_hook=True)
SILENT_WORKER_CONTINUE = replace(SILENT_AGENT_CONTINUE, key="workers.continue_silent_worker", wakes_agent=False)

WORKER_READ_REFUSAL = NudgeDeclaration("workers.read_outside_worktree", NudgeType.REFUSAL, "That file is outside your worktree: use what is in your worktree, or ask in your report")
UNSTARTED_JOB = NudgeDeclaration("workers.job_not_started", NudgeType.STEERING, "{name}:{agent} has had work waiting for {minutes} min and has not started: {action}", turn_limited=False, wakes_agent=True)

IDLE_WORKER = NudgeDeclaration("workers.idle_worker", NudgeType.STEERING, "worker:{worker} has stopped", turn_limited=False)
IDLE_WORKER_TASKS = NudgeDeclaration("workers.idle_worker_tasks", NudgeType.STEERING, "worker:{worker} has stopped and holds {tasks}", turn_limited=False)

WORKER_OPERATION_FAILED = NudgeDeclaration("workers.operation_failed", NudgeType.STEERING,
    "Worker command failed: output {output}", turn_limited=False, wakes_agent=True)
WORKER_OPERATION_UNSTARTED = NudgeDeclaration("workers.operation_never_started", NudgeType.STEERING,
    "Worker command never started and changed nothing: give it again; output {output}", turn_limited=False, wakes_agent=True)

WORKER_ROUTE_FALLBACK = NudgeDeclaration("workers.route_fallback", NudgeType.STEERING, "Route {route}: {tasks} went to {program}", turn_limited=False)

CONTEXT_STOP_IMMEDIATE = NudgeDeclaration("workers.context_stop_now", NudgeType.STEERING, "Your context passed the limit and you hold no task: stop now; stopping compacts it", turn_limited=False)
CONTEXT_STOP_AFTER_TASK = NudgeDeclaration("workers.context_stop_between_tasks", NudgeType.STEERING, "Your context passed the limit between tasks: stop now; stopping compacts it and you continue after", turn_limited=False)
CONTEXT_HARD_STOP = NudgeDeclaration("workers.context_hard_stop", NudgeType.REFUSAL, "Your context passed the second limit: no more tools, stop now; it is being compacted", turn_limited=False)
CONTEXT_COMPACTED = NudgeDeclaration("workers.context_compacted", NudgeType.NOTICE, "Your context passed the limit: it is being compacted", turn_limited=False)

WORKER_NUDGES = [PROOF_RUN_STUCK, WORKER_TASK_AWAITED, WORKER_TASK_JOINS, WORKER_UNIT_RUN_PASSED, WORKER_RUN_UNSTARTED, MERGER_WORKER_RUN_UNSTARTED, IDLE_WORKER_TASKS, WORKER_TASK_COUNT, WORKER_COMMIT_PASSED, WORKER_RETIRED_WITH_TASKS, WORKER_OPERATION_UNSTARTED, WORKER_LIBRARIES_LINKED, PROTECTED_FOLDER, WORKER_FOREIGN_LINK, CONTEXT_STOP_AFTER_TASK, CONTEXT_HARD_STOP, CONTEXT_COMPACTED, CONTEXT_STOP_IMMEDIATE, WORKER_OPERATION_NEXT, WORKER_OPERATION_TESTS, WORKER_OPERATION_CONFLICT, WORKER_OPERATION_MERGED, WORKER_OPERATION_JOB, WORKER_OPERATION_COMMITTED, WORKER_OPERATION_STARTED, WORKER_OPERATION_FAILED, WORKER_ROUTE_FALLBACK, WORKER_PROGRAM_UNAVAILABLE, WORKER_PROGRAM_RESUMED, IDLE_WORKER, UNSTARTED_JOB, WORKER_UNMERGED_DUE, WORKER_READ_REFUSAL, SILENT_AGENT_CONTINUE, SILENT_WORKER_CONTINUE, WORKER_STATUS_FIRST, WORKER_UNSTARTED, READER_SAMPLE_READY, WORKER_RUN_RUNS_AFTER_STOP, WORKER_RESTARTED, WORKER_LAUNCH_FAILED, WORKER_HELP_REQUEST, WORKER_REFUSED, WORKER_TASK_BLOCKED, BLOCKED_WORKER_TASK, WORKER_ASKING_STOPPED, WORKER_LIMIT_STOPPED, WORKER_PROCESS_ENDED, WORKER_LIMIT_RAISED, WORKER_MERGE_CONFLICT, WORKER_PROOF_SHORT, CHECKPOINT_FAILURE_FALLBACK, WORKER_ENDED_WITH_TASKS, WORKER_COMMITTED_UNMERGED, WORKER_REUSE, WORKER_NEXT_TASK, WORKER_TASK_REASSIGNED, WORKER_TASK_AFTER_REASSIGNED, WORKER_JUDGE_SCOPE, WORKER_COMMENT_COPY, WORKER_TASK_COMMENT, WORKER_UNFINISHED_TASKS, WORKER_TESTS_PASSED, WORKER_COMMITTED, WORKER_TESTS_FAILED, WORKER_PHASE_TESTS_FAILED, PHASE_TEST_RUN_ALLOWED, PHASE_TEST_REFUSED, WORKER_FILE, WORKER_LOG_DUE, HELPER_INACTIVE, WORKER_UNMERGED, SMALL_BATCH, WORKER_IDLE_STOPPED, MAIN_WORKERS_REFUSED, PROOF_CHECK, PROOF_WAITS, MERGE_WAITS, WORKER_TASK, WORKER_RUN_ENDED, WORKER_OPERATION_PAUSED, WORKER_OPERATION_UPDATED, WORKER_OPERATION_UPDATE_CONFLICT, WORKER_OPERATION_UPDATE_FAILED]
