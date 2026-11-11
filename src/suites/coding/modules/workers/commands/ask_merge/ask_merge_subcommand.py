from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.agents.models.agent import Agent
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from suites.coding.modules.workers.commands.ask_merge.ask_merge import AskMerge
from suites.coding.modules.workers.support.merge_ask_outcome import MergeAskOutcome


class AskMergeSubcommand(Subcommand[AskMerge, MergeAskOutcome]):
    """`journal worker ask-merge "<what the merge holds>"`: the worker asks for the merge of its committed
    unit."""

    cli_name = "worker"
    name = "ask-merge"
    outward = True

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("note", help="what the merge holds, what you changed from the briefs and what you could not check")

    def command(self, arguments: Namespace, caller: Caller) -> AskMerge:
        if not self.queries.query(Agent).filter(id=caller.actor.id, role=CodingHelperRole.WORKER).exists():
            raise Refusal("journal worker ask-merge is for workers", "journal worker merge merges a worker's work")
        return AskMerge(caller.actor.id, arguments.note)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, MergeAskOutcome):
            output.line(value.line())
