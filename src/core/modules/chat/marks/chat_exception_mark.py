from engine.chat.mark_declaration import MarkDeclaration
from core.modules.chat.models.enums.chat_mark_type import ChatMarkType
from core.modules.chat.models.enums.chat_mark_variant import ChatMarkVariant
from engine.enums.mark_click import MarkClick
from core.modules.chat.support.chat_marks import EXCEPTIONS_FAMILY


class ChatExceptionMark(MarkDeclaration):
    """The mark ChatMarkType.EXCEPTION."""

    type = ChatMarkType.EXCEPTION
    variants = ChatMarkVariant
    family = EXCEPTIONS_FAMILY
    label = "Exceptions of the journal"
    mark_icon = "warning"
    click = MarkClick.UNFOLD
