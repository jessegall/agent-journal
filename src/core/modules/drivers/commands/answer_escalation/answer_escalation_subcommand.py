from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.answer_escalation.answer_escalation import AnswerEscalation
from core.modules.drivers.models.agent_escalation import AgentEscalation


class AnswerEscalationSubcommand(Subcommand[AnswerEscalation, AgentEscalation]):
    """`journal escalation answer <n> --continue "<what to do>"`: the responder tells the escalated agent how
    to go on."""

    cli_name = "escalation"
    name = "answer"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("escalation", type=int)
        parser.add_argument("--continue", dest="text", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> AnswerEscalation:
        return AnswerEscalation(arguments.escalation, arguments.text)
