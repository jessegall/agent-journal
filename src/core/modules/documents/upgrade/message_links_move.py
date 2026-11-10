from core.base.database.database import Database
from engine.upgrade.move_context import MoveContext
from engine.upgrade.move_map import MoveMap
from engine.upgrade.move_report import MoveReport
from engine.upgrade.version_four_move import VersionFourMove
from engine.upgrade.version_four_source import VersionFourSource
from core.modules.documents.upgrade.link_rows import LinkRows


class MessageLinksMove(VersionFourMove):
    """Recovers general links whose endpoints do not need question IDs."""

    name = "message-links-v1"
    references = ["links"]
    id_modules = ["journal.core.actors", "journal.core.agents", "journal.core.messages", "journal.core.tasks", "journal.core.plans"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        return LinkRows(target, map, context).move(link for link in source.rows("links") if not LinkRows.has_question_end(link))
