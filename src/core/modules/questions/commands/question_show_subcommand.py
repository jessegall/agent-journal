from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.question import Question
from core.modules.questions.queries.question_query import QuestionQuery


class QuestionShowSubcommand(ReadSubcommand[Question]):
    """`journal question show <n>`: one question with its choices and its answer, or that it is not answered yet."""

    cli_name = "question"
    name = "show"

    def __init__(self, questions: QuestionQuery) -> None:
        self.questions = questions

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> Question:
        return self.questions.find(arguments.id)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, Question):
            return
        output.line(f"question {value.id}: {value.text}")
        if value.options:
            output.line(f"choices: {' / '.join(value.options)}")
        output.line(f"state: {value.state}")
        if value.state is QuestionState.ANSWERED:
            output.line(f"answer: {value.answer}")
            if value.message_id is not None:
                output.line(f"answered by message {value.message_id}")
            output.line("act on the answer")
        elif value.state is QuestionState.OPEN:
            output.line("answer: not answered yet")
