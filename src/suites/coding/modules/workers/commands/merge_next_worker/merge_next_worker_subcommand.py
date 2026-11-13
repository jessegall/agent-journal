from engine.cli.agent_number import AgentNumber
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.command.command import Command
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.commands.support.worker_command_request import WorkerCommandRequest
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome
from suites.coding.modules.workers.support.worker_settings import MERGER_COMMANDS
from suites.coding.modules.workers.commands.merge_next_worker.merge_next_worker import MergeNextWorker
from core.modules.agents.support.agent_label import AgentLabel
from engine.cli.row_numbers import RowNumbers


class MergeNextWorkerSubcommand(Subcommand[Command[object], MergeOutcome]):
    """`journal merger merge <worker> [--read-important "<answer>"]`: queues the merge of the worker's work with the
    other runs, then says it merged and prints the commands to run after it."""

    cli_name = "merger"
    name = "merge"

    def __init__(self, settings: SettingValues, numbers: RowNumbers, requests: WorkerCommandRequest) -> None:
        self.numbers, self.settings, self.requests = numbers, settings, requests

    def arguments(self, parser: ArgumentParser) -> None:
        WorkerCommandRequest.arguments(parser)
        parser.add_argument("worker_id", type=AgentNumber)
        parser.add_argument("--read-important", default="")

    def command(self, arguments: Namespace, caller: Caller) -> Command[object]:
        return self.requests.command(MergeNextWorker(arguments.worker_id, arguments.read_important), arguments.worker_id,
                                     ["merger", "merge", str(arguments.worker_id.number), "--read-important", arguments.read_important], arguments, caller)

    def write_output(self, value: object, output: Output) -> None:
        if self.requests.write_output(value, output):
            return
        if isinstance(value, MergeOutcome):
            commit = value.worktree.commit_before_merge
            output.line(f"{AgentLabel.labelled_row(value.worktree.session_agent_id, self.numbers, "worker").text} merged into {value.worktree.base_branch}")
            for line in self.settings.texts(MERGER_COMMANDS):
                output.line(f"run: {line.replace('{commit}', str(commit))}")
            output.line(f"merged from {commit}")
