from engine.chat.mark_declaration import MarkDeclaration
from core.modules.helpers.models.enums.program_mark_type import ProgramMarkType
from core.modules.helpers.models.enums.program_mark_variant import ProgramMarkVariant
from core.modules.helpers.support.program_marks import PROGRAMS_FAMILY


class ProgramOutageMark(MarkDeclaration):
    """The mark ProgramMarkType.OUTAGE."""

    type = ProgramMarkType.OUTAGE
    variants = ProgramMarkVariant
    family = PROGRAMS_FAMILY
    label = "Program outages"
    mark_icon = "subagent"
