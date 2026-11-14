from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.subcommand.row_list import RowList
from core.modules.tasks.models.task_tag import TaskTag
from core.modules.tasks.models.task_tag_word import TaskTagWord

TAG_TERMS_REASON = "the tag list shows every tag word in use, in the order of the words"


class TaskTagsSubcommand(ReadSubcommand[RowList]):
    """Lists tag counts across the project, or the words on one task."""

    cli_name = "task"
    name = "tags"
    row_line = "{word}  {count}"
    empty_line = "nothing found"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int, nargs="?", default=None)

    def read(self, arguments: Namespace, caller: Caller) -> RowList:
        if arguments.task_id is not None:
            tags = self.queries.query(TaskTag).filter(task_id=arguments.task_id).ordered("word").get()
            return RowList([{"word": tag.word, "count": 1} for tag in tags])
        counts = self.queries.query(TaskTagWord).every_row(TAG_TERMS_REASON)
        return RowList([{"word": item.word, "count": item.count} for item in counts])
