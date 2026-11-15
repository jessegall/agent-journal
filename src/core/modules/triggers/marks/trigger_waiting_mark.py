from engine.chat.mark_declaration import MarkDeclaration
from engine.enums.mark_click import MarkClick
from core.modules.triggers.models.enums.trigger_mark_type import TriggerMarkType
from core.modules.triggers.models.enums.trigger_mark_variant import TriggerMarkVariant
from core.modules.triggers.support.trigger_marks import TRIGGERS_FAMILY


class TriggerWaitingMark(MarkDeclaration):
    """The mark TriggerMarkType.WAITING."""

    type = TriggerMarkType.WAITING
    variants = TriggerMarkVariant
    family = TRIGGERS_FAMILY
    label = "Trigger"
    mark_icon = "bulb"
    click = MarkClick.OPEN_ROW
    process = True
