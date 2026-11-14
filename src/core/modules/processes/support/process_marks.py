from engine.chat.mark_button import MarkButton
from engine.enums.mark_colouring import MarkColouring
from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.enums.mark_group import MarkGroup
from core.modules.processes.models.enums.process_mark_type import ProcessMarkType
from core.modules.processes.models.enums.process_mark_variant import ProcessMarkVariant

COMMANDS_FAMILY = MarkFamily("processes.commands", "Commands", "terminal", MarkGroup.WORK, MarkColouring.OUTCOME)
RUNNING_VARIANTS = (ProcessMarkVariant.RUNNING.value, ProcessMarkVariant.BACKGROUND.value)
STOP = MarkButton("stop", "Stop", "output stop {row_id}", variants=(ProcessMarkVariant.QUEUED.value, *RUNNING_VARIANTS))
DOCK = MarkButton("dock", "Dock", "dock add processes.output process {row_id}", variants=RUNNING_VARIANTS)
UNWATCH = MarkButton("close", "Unwatch", "output unwatch {row_id}")

PROCESS_MARKS = [MarkDeclaration(ProcessMarkType.COMMAND, ProcessMarkVariant, COMMANDS_FAMILY, "Commands run", "terminal", buttons=[STOP, DOCK], process=True)]

