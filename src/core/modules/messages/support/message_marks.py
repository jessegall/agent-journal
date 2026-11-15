from engine.chat.mark_family import MarkFamily
from engine.enums.mark_group import MarkGroup

SUMMARIES_FAMILY = MarkFamily("messages.thoughts", "The agent's words", "words", MarkGroup.AGENT)
FILED_FAMILY = MarkFamily("messages.filed", "Filed from your messages", "filed", MarkGroup.WORK)
EDITED_FAMILY = MarkFamily("messages.edited", "Messages the agent edited", "summary", MarkGroup.AGENT)
