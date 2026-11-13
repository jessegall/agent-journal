from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.command.command import Command
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.commit_worker_work.commit_worker_work import CommitWorkerWork
from suites.coding.modules.workers.commands.support.worker_step_check import DELIVERY_EVENTS, WorkerStepCheck
from suites.coding.modules.workers.models.enums.submission import Submission
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.commit_outcome import CommitOutcome
from suites.coding.modules.workers.support.commit_differences import differences_flag, required_differences
from suites.coding.modules.workers.commands.support.worker_command_request import WorkerCommandRequest
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_run_answer import WorkerRunAnswer


class CommitWorkerWorkSubcommand(Subcommand[Command[object], CommitOutcome]):
    """`journal worker commit`: commits all the worker's tasks, once none is queued and its started task has a
    proof for every point of its brief. A worker told that its base branch moved runs journal worker update at
    a stopping point first, and settles any clashing files before it commits."""

    cli_name = "worker"
    name = "commit"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        WorkerCommandRequest.arguments(parser)
        differences_flag(parser)

    def __init__(self, worktrees: WorktreeQuery, step_check: WorkerStepCheck, requests: WorkerCommandRequest, run_answer: WorkerRunAnswer, guidance: WorkerGuidance) -> None:
        self.worktrees, self.step_check, self.requests, self.run_answer = worktrees, step_check, requests, run_answer
        self.guidance = guidance

    def command(self, arguments: Namespace, caller: Caller) -> Command[object]:
        differences = required_differences(arguments)
        worktree = self.worktrees.worker_worktree(caller.actor.id)
        if worktree is not None:
            self.step_check.check(worktree, DELIVERY_EVENTS, f"fix each of these in your worktree, then run journal worker {self.name} again")
        return self.requests.command(CommitWorkerWork(differences), caller.actor.id, ["worker", self.name, "--differences", differences], arguments, caller)

    def write_output(self, value: object, output: Output) -> None:
        if self.run_answer.write(value, output):
            return
        if not isinstance(value, CommitOutcome):
            return
        output.line(value.text())
        output.line(value.next_step_text)
        for note in value.notes:
            output.line(note)
        if value.submission is Submission.COMMITTED:
            output.line(self.guidance.task_line(value.tasks[0]))
