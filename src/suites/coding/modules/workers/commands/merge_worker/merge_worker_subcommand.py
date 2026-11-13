from engine.cli.agent_number import AgentNumber
from engine.command.command import Command
from suites.coding.modules.workers.support.worker_command_request import WorkerCommandRequest
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.merge_worker.merge_worker import MergeWorker
from suites.coding.modules.workers.commands.merge_finished_tasks.merge_finished_tasks import MergeFinishedTasks
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome
from suites.coding.modules.workers.commands.support.worker_step_check import WorkerStepCheck
from core.modules.agents.support.agent_label import AgentLabel
from engine.cli.row_numbers import RowNumbers

MERGE_EVENTS = ["worker_merging"]


class MergeWorkerSubcommand(Subcommand[Command[object], MergeOutcome]):
    """`journal worker merge <worker>`: the worker's checked work goes into the environment's branch."""

    cli_name = "worker"
    name = "merge"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        WorkerCommandRequest.arguments(parser)
        parser.add_argument("worker_id", type=AgentNumber)
        parser.add_argument("--read-important", default="", help="what you make of the worker's important log lines")
        parser.add_argument("--reconcile", default="", help="what you checked of a required command that ended uncertain")
        parser.add_argument("--up-to", default="", help="a task number or a commit: take in the worker's checked work up to it while the worker goes on")

    def __init__(self, worktrees: WorktreeQuery, step_check: WorkerStepCheck, requests: WorkerCommandRequest, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.requests = requests
        self.worktrees, self.step_check = worktrees, step_check

    def command(self, arguments: Namespace, caller: Caller) -> Command[object]:
        if arguments.up_to:
            return self.requests.command(MergeFinishedTasks(arguments.worker_id, arguments.up_to), arguments.worker_id, ["worker", "merge", str(arguments.worker_id.number), "--up-to", arguments.up_to], arguments, caller)
        worktree = self.worktrees.worker_worktree(arguments.worker_id)
        if worktree is not None:
            self.step_check.check(worktree, MERGE_EVENTS, "the worker puts it right: journal worker send it the reason, then merge again")
        command = MergeWorker(arguments.worker_id, arguments.read_important, arguments.reconcile)
        return self.requests.command(command, arguments.worker_id,
                                     ["worker", "merge", str(arguments.worker_id.number), "--read-important", arguments.read_important, "--reconcile", arguments.reconcile], arguments, caller)

    def write_output(self, value: object, output: Output) -> None:
        if self.requests.write_output(value, output):
            return
        if not isinstance(value, MergeOutcome):
            return
        output.row(value.worktree)
        if value.refusal:
            output.line(f"the merge of {AgentLabel.labelled_row(value.worktree.session_agent_id, self.numbers, "worker").text} was refused before anything was merged: {value.refusal}; the findings went back to the worker")
        if value.conflicts:
            output.line(f"merging {value.worktree.base_branch} in clashed on {', '.join(value.conflicts)}: task {value.worktree.task_id} went back to"
                        f" {AgentLabel.labelled_row(value.worktree.session_agent_id, self.numbers, "worker").text}")
