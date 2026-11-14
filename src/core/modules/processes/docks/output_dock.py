from engine.chat.dock_declaration import DockDeclaration
from core.modules.processes.models.enums.process_dock_type import ProcessDockType
from core.modules.processes.support.process_marks import STOP


class OutputDock(DockDeclaration):
    """The dock of ProcessDockType.OUTPUT."""

    type = ProcessDockType.OUTPUT
    icon = "terminal"
    title = "Output {row_id}"
    body = "output-dock.js"
    buttons = [STOP]
    most = 6
    leaves_after_seconds = 5
    draws_head = True
    folds = "Output"
    reads = ["process card", "process show", "output peek", "output page"]
