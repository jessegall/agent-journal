from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.modules.drivers.models.enums.bypass_mark_type import BypassMarkType
from core.modules.drivers.models.enums.bypass_mark_variant import BypassMarkVariant

BYPASS_FAMILY = MarkFamily("drivers.bypass", "Unchecked work", "stop", MarkGroup.JOURNAL)

BYPASS_MARKS = [MarkDeclaration(BypassMarkType.BYPASS, BypassMarkVariant, BYPASS_FAMILY, "Hooks that went through while the journal did not answer", "stop")]
