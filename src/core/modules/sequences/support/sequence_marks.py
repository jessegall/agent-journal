from engine.chat.mark_click import MarkClick
from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.chat.mark_group import MarkGroup
from core.modules.sequences.models.enums.sequence_mark_type import SequenceMarkType
from core.modules.sequences.models.enums.sequence_mark_variant import SequenceMarkVariant

SEQUENCES_FAMILY = MarkFamily("sequences.sequences", "Sequences", "sequence", MarkGroup.WORK)

SEQUENCE_MARKS = [MarkDeclaration(SequenceMarkType.SEQUENCE, SequenceMarkVariant, SEQUENCES_FAMILY, "Sequences the main agent follows", "sequence", click=MarkClick.OPEN_ROW)]
