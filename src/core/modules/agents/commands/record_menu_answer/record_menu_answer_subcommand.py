from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.agents.commands.record_menu_answer.record_menu_answer import RecordMenuAnswer
from core.modules.agents.models.menu_answer import MenuAnswer


class RecordMenuAnswerSubcommand(Subcommand[RecordMenuAnswer, MenuAnswer]):
    """`journal agent menu-answer <agent> <question> <answer>`: the launcher tells what it pressed on a menu."""

    cli_name = "agent"
    name = "menu-answer"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=int)
        parser.add_argument("question")
        parser.add_argument("answer")

    def command(self, arguments: Namespace, caller: Caller) -> RecordMenuAnswer:
        return RecordMenuAnswer(arguments.agent_id, arguments.question, arguments.answer)
