from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.modules.helpers.models.enums.program_mark_type import ProgramMarkType
from core.modules.helpers.models.enums.program_mark_variant import ProgramMarkVariant

PROGRAMS_FAMILY = MarkFamily("helpers.programs", "Programs", "subagent", MarkGroup.JOURNAL)
PROGRAM_MARKS = [MarkDeclaration(ProgramMarkType.OUTAGE, ProgramMarkVariant, PROGRAMS_FAMILY,
                                "Program outages", "subagent")]
