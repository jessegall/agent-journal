from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.modules.questions.models.question import Question
from core.modules.questions.queries.question_query import QuestionQuery


class QuestionListSubcommand(ReadSubcommand[tuple[Question, ...]]):
    """`journal question list`: the open questions of the caller's environment, each with its number, text and choices."""

    cli_name = "question"
    name = "list"

    def __init__(self, questions: QuestionQuery) -> None:
        self.questions = questions

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> tuple[Question, ...]:
        query = self.questions.open_ones()
        if caller.environment_id is not None:
            query = query.in_environment(caller.environment_id)
        return tuple(query.oldest().all_rows())

    def write_output(self, value: object, output: Output) -> None:
        if not is_tuple(value):
            return
        questions = [row for row in value if isinstance(row, Question)]
        for question in questions:
            choices = f"  [{' / '.join(question.options)}]" if question.options else ""
            output.line(f"{question.id}  {question.text}{choices}")
        if not questions:
            output.line("no open questions")
