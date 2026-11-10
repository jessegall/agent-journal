from engine.enums.mark_click import MarkClick
from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.enums.mark_group import MarkGroup
from core.modules.messages.models.enums.message_mark_type import MessageMarkType
from core.modules.messages.models.enums.message_mark_variant import MessageMarkVariant

SUMMARIES_FAMILY = MarkFamily("messages.thoughts", "The agent's words", "words", MarkGroup.AGENT)
FILED_FAMILY = MarkFamily("messages.filed", "Filed from your messages", "filed", MarkGroup.WORK)
EDITED_FAMILY = MarkFamily("messages.edited", "Messages the agent edited", "summary", MarkGroup.AGENT)

MESSAGE_MARKS = [
    MarkDeclaration(MessageMarkType.SUMMARY, MessageMarkVariant, SUMMARIES_FAMILY, "Summaries of the agent's words", "summary", click=MarkClick.OPEN_ROW),
    MarkDeclaration(MessageMarkType.FILED, MessageMarkVariant, FILED_FAMILY, "Filed from your messages", "filed", click=MarkClick.OPEN_ROW),
    MarkDeclaration(MessageMarkType.EDITED, MessageMarkVariant, EDITED_FAMILY, "Messages the agent edited", "summary", click=MarkClick.OPEN_ROW),
]
