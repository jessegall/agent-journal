from engine.chat.mark_declaration import MarkDeclaration
from engine.enums.mark_click import MarkClick
from core.modules.messages.models.enums.message_mark_type import MessageMarkType
from core.modules.messages.models.enums.message_mark_variant import MessageMarkVariant
from core.modules.messages.support.message_marks import FILED_FAMILY


class MessageFiledMark(MarkDeclaration):
    """The mark MessageMarkType.FILED."""

    type = MessageMarkType.FILED
    variants = MessageMarkVariant
    family = FILED_FAMILY
    label = "Filed from your messages"
    mark_icon = "filed"
    click = MarkClick.OPEN_ROW
