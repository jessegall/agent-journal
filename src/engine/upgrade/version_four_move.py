from typing import ClassVar

from collections.abc import Sequence

from core.base.database.database import Database
from engine.upgrade.move_context import MoveContext
from engine.upgrade.move_map import MoveMap
from engine.upgrade.move_report import MoveReport
from engine.upgrade.version_four_source import VersionFourSource


class VersionFourMove:
    """How a module carries its rows from a version 4 journal: the version 4 tables it reads, the ones it
    knowingly leaves, the modules whose new ids it looks up, and the move itself, which reads the
    source, writes the rows into version 5 directly and records each in the map. A row it writes raises
    no create event, so no create listener announces old news; the module's one upgrade.moved event,
    with its counts, is what a listener that must see moved rows reads."""

    name: ClassVar[str]
    reads: ClassVar[Sequence[str]] = ()
    references: ClassVar[Sequence[str]] = ()
    setting_keys: ClassVar[Sequence[str]] = ()
    drops: ClassVar[Sequence[str]] = ()
    id_modules: ClassVar[Sequence[str]] = ()

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        raise NotImplementedError(f"{type(self).__name__} states no move")
