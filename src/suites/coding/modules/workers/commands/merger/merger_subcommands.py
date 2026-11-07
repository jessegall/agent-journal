from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.merger.merger_commands import TellMainAgent, MergeNextWorker, PassWorkerToMain, ReadNextMerge, SendMergeFindings
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome
from suites.coding.modules.workers.support.worker_settings import MERGER_COMMANDS


class MergerNextSubcommand(Subcommand[ReadNextMerge, str]):
    """`journal merger next`: the next worker waiting for its merge, with its briefs, proofs and log lines."""

    cli_name = "merger"
    name = "next"

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def command(self, arguments: Namespace, caller: Caller) -> ReadNextMerge:
        return ReadNextMerge()


class MergerMergeSubcommand(Subcommand[MergeNextWorker, MergeOutcome]):
    """`journal merger merge <worker>`: takes the worker's work into the branch."""

    cli_name = "merger"
    name = "merge"

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> MergeNextWorker:
        return MergeNextWorker(arguments.worker_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, MergeOutcome):
            commit = value.worktree.commit_before_merge
            for line in self.settings.texts(MERGER_COMMANDS):
                output.line(f"run: {line.replace('{commit}', str(commit))}")
            output.line(f"merged from {commit}")


class MergerPassSubcommand(Subcommand[PassWorkerToMain, None]):
    """`journal merger pass <worker> "<why>"`: leaves the worker to the main agent."""

    cli_name = "merger"
    name = "pass"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=int)
        parser.add_argument("reason")

    def command(self, arguments: Namespace, caller: Caller) -> PassWorkerToMain:
        return PassWorkerToMain(arguments.worker_id, arguments.reason)


class MergerFindingsSubcommand(Subcommand[SendMergeFindings, None]):
    """`journal merger findings <worker> "<findings>"`: sends the judge's findings back to the worker."""

    cli_name = "merger"
    name = "findings"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=int)
        parser.add_argument("findings")

    def command(self, arguments: Namespace, caller: Caller) -> SendMergeFindings:
        return SendMergeFindings(arguments.worker_id, arguments.findings)


class MergerTellSubcommand(Subcommand[TellMainAgent, None]):
    """`journal merger tell "<words>"`: hands on to the main agent what it must act on."""

    cli_name = "merger"
    name = "tell"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("text")

    def command(self, arguments: Namespace, caller: Caller) -> TellMainAgent:
        return TellMainAgent(arguments.text)
