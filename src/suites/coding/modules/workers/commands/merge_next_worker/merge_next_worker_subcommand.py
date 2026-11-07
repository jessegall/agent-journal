from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome
from suites.coding.modules.workers.support.worker_settings import MERGER_COMMANDS
from suites.coding.modules.workers.commands.merge_next_worker.merge_next_worker import MergeNextWorker


class MergeNextWorkerSubcommand(Subcommand[MergeNextWorker, MergeOutcome]):
    """`journal merger merge <worker> [--read-important "<answer>"]`: takes the worker's work into the branch and
    says so first, then prints the commands to run after it."""

    cli_name = "merger"
    name = "merge"

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=int)
        parser.add_argument("--read-important", default="")

    def command(self, arguments: Namespace, caller: Caller) -> MergeNextWorker:
        return MergeNextWorker(arguments.worker_id, arguments.read_important)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, MergeOutcome):
            commit = value.worktree.commit_before_merge
            output.line(f"worker {value.worktree.session_agent_id} merged into {value.worktree.base_branch}")
            for line in self.settings.texts(MERGER_COMMANDS):
                output.line(f"run: {line.replace('{commit}', str(commit))}")
            output.line(f"merged from {commit}")
