import re
from argparse import ArgumentParser, Namespace
from collections.abc import Mapping

from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.messages.models.attached_file import AttachedFile
from core.modules.messages.support.attachment_page import AttachmentPage

IMAGE_NAME = re.compile(r"\.(png|jpe?g|gif|webp|svg|bmp|avif)$", re.IGNORECASE)
ALL_KINDS = "all"
IMAGE_KIND = "images"
OTHER_KIND = "other"
PAGE_SIZE_ROWS = 60


class AttachmentListSubcommand(ReadSubcommand[AttachmentPage]):
    """`journal attachment list [--kind all|images|other] [--search <words>] [--skip <n>]`: the files sent with messages, newest first, and how many there are of each kind."""

    cli_name = "attachment"
    name = "list"

    def __init__(self, queries: Queries, environment_names: EnvironmentNames) -> None:
        self.queries, self.environment_names = queries, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")
        parser.add_argument("--kind", choices=(ALL_KINDS, IMAGE_KIND, OTHER_KIND), default=ALL_KINDS)
        parser.add_argument("--search", default="")
        parser.add_argument("--skip", type=int, default=0)
        parser.add_argument("--limit", type=int, default=PAGE_SIZE_ROWS)

    def read(self, arguments: Namespace, caller: Caller) -> AttachmentPage:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("attached files are listed for one environment", "name it with --environment")
        files = sorted(self.queries.query(AttachedFile).filter(environment_id=environment_id).all_rows(), key=lambda row: row.message_id, reverse=True)
        words = arguments.search.strip().lower()
        found = [row for row in files if words in row.name.lower() or words in row.message_text.lower()]
        images = sum(1 for row in found if IMAGE_NAME.search(row.name))
        kept = [row for row in found if arguments.kind == ALL_KINDS or (IMAGE_NAME.search(row.name) is not None) == (arguments.kind == IMAGE_KIND)]
        page = kept[arguments.skip:arguments.skip + arguments.limit]
        return AttachmentPage(tuple(self.listed(row) for row in page), {ALL_KINDS: len(found), IMAGE_KIND: images, OTHER_KIND: len(found) - images}, arguments.skip + arguments.limit >= len(kept))

    @staticmethod
    def listed(row: AttachedFile) -> Mapping[str, object]:
        return {"message_id": row.message_id, "name": row.name, "message_text": row.message_text, "created_at": row.created_at.text, "is_image": IMAGE_NAME.search(row.name) is not None}

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AttachmentPage):
            output.write("\n".join(str(row["name"]) for row in value.rows) or "no attached files", value.json())
