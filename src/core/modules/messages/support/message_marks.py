from engine.chat.mark_category import MarkCategory
from engine.enums.mark_group import MarkGroup

SUMMARIES_FAMILY = MarkCategory("messages.thoughts", "The agent's words", "words", MarkGroup.AGENT)
FILED_FAMILY = MarkCategory("messages.filed", "Filed from your messages", "filed", MarkGroup.WORK)
EDITED_FAMILY = MarkCategory("messages.edited", "Messages the agent edited", "summary", MarkGroup.AGENT)
