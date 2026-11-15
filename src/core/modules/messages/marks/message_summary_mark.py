from engine.chat.mark_declaration import MarkDeclaration
from engine.enums.mark_click import MarkClick
from core.modules.messages.models.enums.message_mark_type import MessageMarkType
from core.modules.messages.models.enums.message_mark_variant import MessageMarkVariant
from core.modules.messages.support.message_marks import SUMMARIES_FAMILY


class MessageSummaryMark(MarkDeclaration):
    """The mark MessageMarkType.SUMMARY."""

    type = MessageMarkType.SUMMARY
    variants = MessageMarkVariant
    family = SUMMARIES_FAMILY
    label = "Summaries of the agent's words"
    mark_icon = "summary"
    click = MarkClick.OPEN_ROW
