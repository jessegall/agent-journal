from core.base.chat.dock_declaration import DockDeclaration
from core.modules.dumps.models.enums.dump_dock_type import DumpDockType

DUMP_DOCKS = [DockDeclaration(DumpDockType.DUMP, "filed", "{row_title}", "dump-dock.js", most=3, reads=["dump show", "dump-item list"])]
