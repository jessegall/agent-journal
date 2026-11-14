from engine.chat.dock_declaration import DockDeclaration
from core.modules.dumps.models.enums.dump_dock_type import DumpDockType


class DumpDock(DockDeclaration):
    """The dock of DumpDockType.DUMP."""

    type = DumpDockType.DUMP
    icon = "inbox"
    title = "{row_title}"
    body = "dump-dock.js"
    most = 3
    reads = ["dump items", "dump show"]
