from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.questions.commands.ask_question.ask_question import AskQuestion
from core.modules.questions.models.question import Question
from core.modules.questions.support.question_place import QuestionPlace
from core.modules.documents.models.enums.comment_selection_type import CommentSelectionType
from core.modules.documents.support.row_refs import RowRefs


class AskQuestionSubcommand(Subcommand[AskQuestion, Question]):
    """`journal question ask <title> --context <sentences> --options a b --recommend a`: the agent asks the
    user and waits for the answer."""

    cli_name = "question"
    name = "ask"
    outward = True

    def __init__(self, refs: RowRefs) -> None:
        self.refs = refs

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("text", metavar="title")
        parser.add_argument("--context", default="")
        parser.add_argument("--options", nargs="+", default=[])
        parser.add_argument("--recommend", default="")
        parser.add_argument("--row")
        parser.add_argument("--quote", default="")
        parser.add_argument("--position", type=int)
        parser.add_argument("--selection-type", type=CommentSelectionType, choices=list(CommentSelectionType), default=CommentSelectionType.TEXT)

    def command(self, arguments: Namespace, caller: Caller) -> AskQuestion:
        place = QuestionPlace(self.refs.resolved(arguments.row) if arguments.row else None, arguments.quote, arguments.position, arguments.selection_type)
        return AskQuestion(arguments.text, arguments.context, tuple(arguments.options), arguments.recommend, place)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, Question):
            return
        output.line(f"question {value.id} asked; waiting for the answer")
        for number, option in enumerate(value.options, 1):
            output.line(f"{number}. {option}{' (recommended)' if option == value.recommended else ''}")
