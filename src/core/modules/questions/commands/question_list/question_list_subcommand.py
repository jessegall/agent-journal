from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.page import Page, is_page
from core.modules.questions.models.question import Question
from core.modules.questions.queries.question_query import QuestionQuery
from core.modules.documents.support.row_refs import RowRefs


class QuestionListSubcommand(ReadSubcommand[Page[Question]]):
    """`journal question list [--all]`: the open questions of the caller's environment, each with its number,
    text and choices; with --all the answered and closed ones too, newest first."""

    cli_name = "question"
    name = "list"

    def __init__(self, questions: QuestionQuery, refs: RowRefs) -> None:
        self.questions, self.refs = questions, refs

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--all", action="store_true")
        parser.add_argument("--row")

    def read(self, arguments: Namespace, caller: Caller) -> Page[Question]:
        query = self.questions if arguments.all else self.questions.open_questions()
        if arguments.row:
            row = self.refs.parsed(arguments.row)
            query = query.filter(row_model=row.model, row_id=row.row_id)
        return query.newest().page() if arguments.all else query.oldest().page()

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
