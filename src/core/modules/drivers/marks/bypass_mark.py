from engine.chat.mark_declaration import MarkDeclaration
from core.modules.drivers.models.enums.bypass_mark_type import BypassMarkType
from core.modules.drivers.models.enums.bypass_mark_variant import BypassMarkVariant
from core.modules.drivers.support.bypass_marks import BYPASS_FAMILY


class BypassMark(MarkDeclaration):
    """The mark BypassMarkType.BYPASS."""

    type = BypassMarkType.BYPASS
    variants = BypassMarkVariant
    family = BYPASS_FAMILY
    label = "Hooks that went through while the journal did not answer"
    mark_icon = "stop"
