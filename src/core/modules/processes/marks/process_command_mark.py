from engine.chat.mark_declaration import MarkDeclaration
from core.modules.processes.models.enums.process_mark_type import ProcessMarkType
from core.modules.processes.models.enums.process_mark_variant import ProcessMarkVariant
from core.modules.processes.support.process_marks import COMMANDS_FAMILY
from core.modules.processes.support.process_marks import DOCK
from core.modules.processes.support.process_marks import STOP


class ProcessCommandMark(MarkDeclaration):
    """The mark ProcessMarkType.COMMAND."""

    type = ProcessMarkType.COMMAND
    variants = ProcessMarkVariant
    family = COMMANDS_FAMILY
    label = "Commands run"
    mark_icon = "terminal"
    buttons = [STOP, DOCK]
    process = True
