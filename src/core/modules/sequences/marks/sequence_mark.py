from engine.chat.mark_declaration import MarkDeclaration
from engine.enums.mark_click import MarkClick
from core.modules.sequences.models.enums.sequence_mark_type import SequenceMarkType
from core.modules.sequences.models.enums.sequence_mark_variant import SequenceMarkVariant
from core.modules.sequences.support.sequence_marks import SEQUENCES_FAMILY


class SequenceMark(MarkDeclaration):
    """The mark SequenceMarkType.SEQUENCE."""

    type = SequenceMarkType.SEQUENCE
    variants = SequenceMarkVariant
    family = SEQUENCES_FAMILY
    label = "Sequences the main agent follows"
    mark_icon = "sequence"
    click = MarkClick.OPEN_ROW
