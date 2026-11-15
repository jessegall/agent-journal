from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.drivers.models.agent_escalation import AgentEscalation


class EscalationShowSubcommand(ReadSubcommand[AgentEscalation]):
    """`journal escalation show <n>`: one escalation whole: its agent, the blocks and work it defers, who was
    asked and how it ended."""

    cli_name = "escalation"
    name = "show"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("escalation", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> AgentEscalation:
        row = self.queries.query(AgentEscalation).filter(id=arguments.escalation).first()
        if row is None:
            raise Refusal(f"there is no escalation {arguments.escalation}", "journal escalation list lists the open ones")
        return row
