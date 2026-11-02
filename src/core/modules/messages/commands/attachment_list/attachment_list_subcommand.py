from core.modules.messages.commands.attachment_list.attachment_list_subcommand_listed_record import AttachmentListSubcommandListedRecord
import re
from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.messages.models.attached_file import AttachedFile
from core.modules.messages.support.attachment_page import AttachmentPage

IMAGE_NAME = re.compile(r"\.(png|jpe?g|gif|webp|svg|bmp|avif)$", re.IGNORECASE)
ALL_CATEGORIES = "all"
IMAGE_CATEGORY = "images"
FILE_CATEGORY = "other"
PAGE_SIZE_ROWS = 60


class AttachmentListSubcommand(ReadSubcommand[AttachmentPage]):
    """`journal attachment list [--kind all|images|other] [--search <words>] [--skip <n>]`: the files sent
    with messages, newest first, and how many there are of each kind."""

    row_line = "{name}"
    empty_line = "no attached files"

    cli_name = "attachment"
    name = "list"

    def __init__(self, queries: Queries, environment_names: EnvironmentNames) -> None:
        self.queries, self.environment_names = queries, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")
        parser.add_argument("--kind", choices=(ALL_CATEGORIES, IMAGE_CATEGORY, FILE_CATEGORY), default=ALL_CATEGORIES)
        parser.add_argument("--search", default="")
        parser.add_argument("--skip", type=int, default=0)
        parser.add_argument("--limit", type=int, default=PAGE_SIZE_ROWS)

    def read(self, arguments: Namespace, caller: Caller) -> AttachmentPage:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("attached files are listed for one environment", "name it with --environment")
        files = sorted(self.queries.query(AttachedFile).filter(environment_id=environment_id).all_rows(), key=lambda row: row.message_id, reverse=True)
        terms = arguments.search.strip().lower()
        matches = [row for row in files if terms in row.name.lower() or terms in row.message_text.lower()]
        images = sum(1 for row in matches if IMAGE_NAME.search(row.name))
        kept = [row for row in matches if arguments.kind == ALL_CATEGORIES or (IMAGE_NAME.search(row.name) is not None) == (arguments.kind == IMAGE_CATEGORY)]
        page = kept[arguments.skip:arguments.skip + arguments.limit]
        return AttachmentPage(tuple(self.listed(row) for row in page), {ALL_CATEGORIES: len(matches), IMAGE_CATEGORY: images, FILE_CATEGORY: len(matches) - images}, arguments.skip + arguments.limit >= len(kept))

    @staticmethod
    def listed(row: AttachedFile) -> AttachmentListSubcommandListedRecord:
        return {"message_id": row.message_id, "name": row.name, "message_text": row.message_text, "created_at": row.created_at.text, "is_image": IMAGE_NAME.search(row.name) is not None}
