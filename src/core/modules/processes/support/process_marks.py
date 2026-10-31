from core.base.chat.dock_declaration import DockDeclaration
from core.base.chat.mark_button import MarkButton
from core.base.chat.mark_click import MarkClick
from core.base.chat.mark_colouring import MarkColouring
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.modules.processes.models.enums.process_dock_type import ProcessDockType
from core.modules.processes.models.enums.process_mark_type import ProcessMarkType
from core.modules.processes.models.enums.process_mark_variant import ProcessMarkVariant

COMMANDS_FAMILY = MarkFamily("processes.commands", "Commands", "terminal", MarkGroup.WORK, MarkColouring.OUTCOME)
STOP = MarkButton("stop", "Stop", "output stop {row_id}")
DOCK = MarkButton("dock", "Dock", "dock add processes.output process {row_id}")
UNWATCH = MarkButton("close", "Stop watching", "output unwatch {row_id}")

PROCESS_MARKS = [MarkDeclaration(ProcessMarkType.COMMAND, ProcessMarkVariant, COMMANDS_FAMILY, "Commands run", "terminal", click=MarkClick.OPEN_ROW, buttons=[STOP, DOCK],
                                 body="output-body.js", process=True)]

PROCESS_DOCKS = [DockDeclaration(ProcessDockType.OUTPUT, "terminal", "Output {row_id}", "output-dock.js", buttons=[STOP, UNWATCH], most=6, leaves_after_seconds=10,
                                 reads=["process show"])]
