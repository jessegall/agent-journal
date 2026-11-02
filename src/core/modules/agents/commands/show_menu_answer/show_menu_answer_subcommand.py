from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.agents.commands.show_menu_answer.show_menu_answer import ShowMenuAnswer
from core.modules.chat.models.chat_mark import ChatMark


class ShowMenuAnswerSubcommand(Subcommand[ShowMenuAnswer, ChatMark]):
    """`journal agent menu-answer <agent> <question> <said>`: the launcher tells what it pressed on a menu."""

    cli_name = "agent"
    name = "menu-answer"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=int)
        parser.add_argument("question")
        parser.add_argument("said")

    def command(self, arguments: Namespace, caller: Caller) -> ShowMenuAnswer:
        return ShowMenuAnswer(arguments.agent_id, arguments.question, arguments.said)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ChatMark):
            output.line(value.text)
