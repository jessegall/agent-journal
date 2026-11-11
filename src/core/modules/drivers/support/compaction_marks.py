from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.enums.mark_group import MarkGroup
from core.modules.drivers.models.enums.compaction_mark_type import CompactionMarkType
from core.modules.drivers.models.enums.compaction_notice_type import CompactionNoticeType

COMPACTIONS_FAMILY = MarkFamily("drivers.compactions", "Compactions", "stop", MarkGroup.JOURNAL)

COMPACTION_MARKS = [MarkDeclaration(CompactionMarkType.COMPACTION, CompactionNoticeType, COMPACTIONS_FAMILY, "Compactions that went wrong", "stop")]
