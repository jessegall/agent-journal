import shlex
from argparse import Namespace
from pathlib import Path

from journal.console.command import Command
from journal.engine.command_events import CommandEvents
from journal.events.worker_clocking_out import WorkerClockingOut
from journal.events.worker_delivering import WorkerDelivering
from journal.events.worker_merging import WorkerMerging
from journal.features.plugins.plugins_options import PluginsOptions
from journal.support.time_source import TimeSource
from journal.features.workers.support.worker_branch import REBASE_STEPS, WorkerBranch
from journal.features.workers.support.affected_tests import AffectedTests
from journal.features.workers.support.test_selection import TestSelection
from journal.features.workers.support.test_turns import TestTurns
from journal.features.workers.support.worker_reports import WorkerReports
from journal.models.task_log import TaskLog
from journal.models.support.ref import Ref
from journal.models.task import Task
from journal.models.worker import Worker
from journal.features.workers.support.queue_advance import QueueAdvance
from journal.repositories.setting_rows import SettingRows
from journal.repositories.task_logs import TaskLogs
from journal.repositories.tasks import Tasks
from journal.repositories.workers import Workers
from journal.support.caller import Caller
from journal.support.rejection import Rejection
from journal.features.workers.support.worker_stacks import WorkerStacks


TESTING_REFUSAL = "your clock-out was held by a plugin before the journal rebased your work and ran your tests; fix what it found, then clock out again"
DELIVERY_REFUSAL = "your tests passed, but a plugin held your work before it reaches the agent that sent you; fix what it found, then clock out again, and the journal runs your tests again"

class DepartureCommand(Command):
    """journal clock-out "<report>": a worker's one report, accepted only once every point of its task's brief has a valid proof, its worktree has no uncommitted file and its branch has been moved up to the branch its work merges into, a clash there sent back to it at once with the files that clash, and, while the journal runs the tests, the tests it names have passed in its worktree, a failing run sent back to it at once with its failing lines. A worker with a task still queued may not clock out: the journal hands it the next as it proves the last point of this one, and it clocks out once, when its queue is done, a blocked task next in the queue or a point proved not done ending the queue there."""

    noun = "clock-out"
    default_verb = "record"

    def __init__(self, workers: Workers, tasks: Tasks, reports: WorkerReports, branch: WorkerBranch, turns: TestTurns, settings: SettingRows, logs: TaskLogs, events: CommandEvents, time_source: TimeSource, affected: AffectedTests, advance: QueueAdvance, stacks: WorkerStacks) -> None:
        self.advance, self.stacks = advance, stacks
        self.workers, self.tasks, self.reports, self.branch = workers, tasks, reports, branch
        self.turns, self.settings, self.logs, self.events, self.time_source, self.affected = turns, settings, logs, events, time_source, affected

    def arguments(self, verbs) -> None:
        record = self.verb(verbs, "record", "hand in your work with your report, once each point of your brief has a proof")
        record.add_argument("report")
        record.add_argument("--tests", default="", help="the arguments the project's test command takes to run the tests that cover the files you changed and the tests you wrote, never the whole suite; the journal runs them before your clock-out stands")

    def record(self, args: Namespace, caller: Caller) -> int:
        worker = self.workers.find(caller.worker_number)
        holdings = self.tasks.holder_task_ids(Ref(Worker.table(), worker.id))
        if not holdings:
            raise Rejection(f"worker {worker.id} has no task: a worker clocks out of the task it was sent on")
        task = self.tasks.find(holdings[0])
        following = self.advance.next_task(worker, task)
        if following is not None:
            raise Rejection(f"you clock out once your queue is done: prove task {task.id}, and its last proof hands you task {following.id}")
        missing = self.advance.unproved(task)
        if missing:
            raise Rejection(f"point {', '.join(map(str, missing))} of task {task.id} has no proof: `journal proof <point> \"<file:line and test>\"`")
        start_heads = self.branch.worktree_heads(worker)
        self.branch.commit_changes(worker, f"Task {task.id}: {task.title}")
        self.plugin_check(WorkerClockingOut, worker, task, TESTING_REFUSAL)
        clashing = self.clashing(worker)
        if clashing:
            raise Rejection(f"your work, rebased onto {self.branch.project_heads(worker)}, clashes: {clashing}; {REBASE_STEPS}, then clock out")
        uncommitted = self.branch.uncommitted_files(worker) if worker.worktree else []
        if uncommitted:
            raise Rejection(f"still not committed after the journal's commit: {', '.join(uncommitted)}; check git status, fix it and clock out")
        strays = self.branch.other_repository_folders(worker) if worker.worktree else []
        if strays:
            raise Rejection(f"your worktree has folders outside your task's repositories, which would be lost: {', '.join(strays)}; move or remove them")
        lying = self.branch.branch_untracked_files(worker) if worker.worktree else []
        if lying:
            raise Rejection(f"your branch adds {', '.join(lying)}, untracked in the project: git rm --cached them, commit, clock out again")
        if self.branch.worktree_heads(worker) != start_heads:
            print(f"the journal committed your work and rebased it onto the project's branch, at {self.branch.project_heads(worker)}")
        if worker.rebase_due:
            self.workers.save(self.workers.find(worker.id).rebased(f"its worktree rebased onto the project's branch at its clock-out, at {self.branch.project_heads(worker)}", self.time_source.moment().timestamp()), caller.actor)
        left = self.stacks.running(self.branch.place(worker)) if worker.worktree else []
        if left:
            raise Rejection(f"your Docker stacks still run: {', '.join(left)}; take them down with their volumes before you clock out ({self.stacks.command(left)}), then clock out again")
        if self.turns.has_command(str(self.branch.place(worker))):
            self.tested(worker, task, args.tests, caller)
        self.plugin_check(WorkerDelivering, worker, task, DELIVERY_REFUSAL)
        self.reports.delivered(worker, args.report, caller.actor)
        print(f"worker {worker.id} clocked out of task {task.id}; the agent that sent you checks each proof")
        started = self.stacks.running(self.branch.place(worker)) if worker.worktree else []
        if started:
            print(f"the journal took down the Docker stacks its test run started: {', '.join(self.stacks.taken_down(started))}")
        return 0

    def plugin_check(self, event_class: type[WorkerMerging], worker: Worker, task: Task, refusal_heading: str) -> None:
        if not worker.worktree:
            return
        refusals = self.events.worker_merging(self.branch.merging_event(event_class, worker, task.id, self.settings.integer(PluginsOptions.CLOCK_OUT_WINDOW_SECONDS) * 1000))
        if refusals:
            raise Rejection(refusal_heading + "\n" + "\n".join(refusals))

    def tested(self, worker: Worker, task: Task, tests: str, caller: Caller) -> None:
        folder = self.branch.place(worker)
        if not TestSelection.parsed(tests).names_tests(folder):
            raise Rejection(f"name the tests for {', '.join(self.branch.touched(worker) or ()) or 'your changes'}: journal clock-out \"<report>\" --tests \"<args>\"")
        turn, run_lines = self.turns.checked(worker, self.with_affected(worker, tests.strip(), folder), caller)
        if not turn.has_passed():
            raise Rejection(f"your tests did not pass, so your clock-out does not stand: fix them and clock out again\n{run_lines}")
        self.logs.save(TaskLog.build(task, f"tests passed at clock-out: {turn.command}", self.time_source.moment().timestamp()), caller.actor)

    def with_affected(self, worker: Worker, tests: str, folder: Path) -> str:
        missing = TestSelection.parsed(tests).missing(self.affected.selection(worker))
        if not missing:
            return tests
        print(f"the journal runs the tests that cover your changes and that you did not name too: {' '.join(missing)}")
        return f"{tests} && {self.turns.command(str(folder))} {shlex.join(missing)}"

    def clashing(self, worker: Worker) -> str:
        return self.branch.rebased_onto_branch(worker)

