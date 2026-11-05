from core.modules.messages.support.attachment_list_row import AttachmentListRow
import re
from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.messages.models.attached_file import AttachedFile
from core.modules.messages.support.attachment_page import AttachmentPage

IMAGE_NAME = re.compile(r"\.(png|jpe?g|gif|webp|svg|bmp|avif)$", re.IGNORECASE)
ALL_CATEGORIES = "all"
IMAGE_CATEGORY = "images"
FILE_CATEGORY = "other"
PAGE_SIZE_ROWS = 60


class AttachmentListSubcommand(ReadSubcommand[AttachmentPage]):
    """`journal attachment list [--category all|images|other] [--search <words>] [--skip <n>]`: the files sent
    with messages, newest first, and how many there are of each category."""

    row_line = "{name}"
    empty_line = "no attached files"

    cli_name = "attachment"
    name = "list"
    environment_refusal = "attached files are listed for one environment"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--category", choices=(ALL_CATEGORIES, IMAGE_CATEGORY, FILE_CATEGORY), default=ALL_CATEGORIES)
        parser.add_argument("--search", default="")
        parser.add_argument("--skip", type=int, default=0)
        parser.add_argument("--limit", type=int, default=PAGE_SIZE_ROWS)

    def read(self, arguments: Namespace, caller: Caller) -> AttachmentPage:
        files = sorted(self.queries.query(AttachedFile).all_rows(), key=lambda row: row.message_id, reverse=True)
        terms = arguments.search.strip().lower()
        matches = [row for row in files if terms in row.name.lower() or terms in row.message_text.lower()]
        images = sum(1 for row in matches if IMAGE_NAME.search(row.name))
        kept = [row for row in matches if arguments.category == ALL_CATEGORIES or (IMAGE_NAME.search(row.name) is not None) == (arguments.category == IMAGE_CATEGORY)]
        page = kept[arguments.skip:arguments.skip + arguments.limit]
        return AttachmentPage(tuple(self.listed(row) for row in page), {ALL_CATEGORIES: len(matches), IMAGE_CATEGORY: images, FILE_CATEGORY: len(matches) - images}, arguments.skip + arguments.limit >= len(kept))

    @staticmethod
    def listed(row: AttachedFile) -> AttachmentListRow:
        return {"message_id": row.message_id, "name": row.name, "message_text": row.message_text, "created_at": row.created_at.text, "is_image": IMAGE_NAME.search(row.name) is not None}
