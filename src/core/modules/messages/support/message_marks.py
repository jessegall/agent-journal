from core.base.chat.mark_click import MarkClick
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.modules.messages.models.enums.message_mark_type import MessageMarkType
from core.modules.messages.models.enums.message_mark_variant import MessageMarkVariant

THOUGHTS_FAMILY = MarkFamily("messages.thoughts", "The agent's words", "words", MarkGroup.AGENT)
FILED_FAMILY = MarkFamily("messages.filed", "Filed from your messages", "filed", MarkGroup.WORK)

MESSAGE_MARKS = [
    MarkDeclaration(MessageMarkType.THOUGHT, MessageMarkVariant, THOUGHTS_FAMILY, "Summaries of the agent's words", "summary", click=MarkClick.OPEN_ROW),
    MarkDeclaration(MessageMarkType.FILED, MessageMarkVariant, FILED_FAMILY, "Filed from your messages", "filed", click=MarkClick.OPEN_ROW),
]
