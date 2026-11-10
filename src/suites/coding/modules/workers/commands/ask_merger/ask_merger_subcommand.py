from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.base.subcommand.subcommand import Subcommand
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.commands.ask_merger.ask_merger import AskMerger
from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.support.coding_helper_role import CodingHelperRole


class AskMergerSubcommand(Subcommand[AskMerger, str]):
    """`journal worker ask "<what>" --about <topic>`: a worker asks the merger and hears what to do meanwhile."""

    cli_name = "worker"
    name = "ask"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("text")
        parser.add_argument("--about", default=AskTopic.GENERAL.value)

    def command(self, arguments: Namespace, caller: Caller) -> AskMerger:
        if not self.queries.query(Agent).filter(id=caller.actor.id, role=CodingHelperRole.WORKER).exists():
            raise Refusal("only a worker asks the merger", "journal message send reaches an agent")
        if arguments.about not in AskTopic:
            raise Refusal(f"{arguments.about} is not a topic", f"name one of: {', '.join(AskTopic)}")
        if not arguments.text.strip():
            raise Refusal("the ask has no words", "say what you need")
        return AskMerger(caller.actor.id, AskTopic(arguments.about), arguments.text)
