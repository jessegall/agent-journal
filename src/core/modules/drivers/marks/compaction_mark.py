from engine.chat.mark_declaration import MarkDeclaration
from core.modules.drivers.models.enums.compaction_mark_type import CompactionMarkType
from core.modules.drivers.models.enums.compaction_notice_type import CompactionNoticeType
from core.modules.drivers.support.compaction_marks import COMPACTIONS_FAMILY


class CompactionMark(MarkDeclaration):
    """The mark CompactionMarkType.COMPACTION."""

    type = CompactionMarkType.COMPACTION
    variants = CompactionNoticeType
    family = COMPACTIONS_FAMILY
    label = "Compactions that went wrong"
    mark_icon = "stop"
