from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.page import Page, is_page
from core.modules.questions.models.question import Question
from core.modules.questions.queries.question_query import QuestionQuery


class QuestionListSubcommand(ReadSubcommand[Page[Question]]):
    """`journal question list`: the open questions of the caller's environment, each with its number, text and
    choices."""

    cli_name = "question"
    name = "list"

    def __init__(self, questions: QuestionQuery) -> None:
        self.questions = questions

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> Page[Question]:
        query = self.questions.open_ones()
        if caller.environment_id is not None:
            query = query.environment(caller.environment_id)
        return query.oldest().page()

    def write_output(self, value: object, output: Output) -> None:
        if not is_page(value):
            return
        if output.json_output:
            output.page(value)
            return
        questions = [row for row in value.rows if isinstance(row, Question)]
        for question in questions:
            choices = f"  [{' / '.join(question.options)}]" if question.options else ""
            output.line(f"{question.id}  {question.text}{choices}")
        if not questions:
            output.line("no open questions")
