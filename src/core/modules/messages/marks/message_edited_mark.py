from engine.chat.mark_declaration import MarkDeclaration
from engine.enums.mark_click import MarkClick
from core.modules.messages.models.enums.message_mark_type import MessageMarkType
from core.modules.messages.models.enums.message_mark_variant import MessageMarkVariant
from core.modules.messages.support.message_marks import EDITED_FAMILY


class MessageEditedMark(MarkDeclaration):
    """The mark MessageMarkType.EDITED."""

    type = MessageMarkType.EDITED
    variants = MessageMarkVariant
    family = EDITED_FAMILY
    label = "Messages the agent edited"
    mark_icon = "summary"
    click = MarkClick.OPEN_ROW
