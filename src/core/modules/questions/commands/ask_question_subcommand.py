from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.questions.commands.ask_question import AskQuestion
from core.modules.questions.models.question import Question


class AskQuestionSubcommand(Subcommand[AskQuestion, Question]):
    """`journal question ask <text> --options a b --recommend a`: the agent asks the user and waits for the answer."""

    cli_name = "question"
    name = "ask"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("text")
        parser.add_argument("--options", nargs="+", default=[])
        parser.add_argument("--recommend", default="")

    def command(self, arguments: Namespace, caller: Caller) -> AskQuestion:
        return AskQuestion(arguments.text, tuple(arguments.options), arguments.recommend)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, Question):
            return
        output.line(f"question {value.id} asked; waiting for the answer")
        for number, option in enumerate(value.options, 1):
            output.line(f"{number}. {option}{' (recommended)' if option == value.recommended else ''}")
