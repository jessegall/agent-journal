from engine.chat.mark_button import MarkButton
from engine.chat.mark_family import MarkFamily
from engine.enums.mark_group import MarkGroup

SUGGESTIONS_FAMILY = MarkFamily("suggestions.suggestions", "Suggestions", "bulb", MarkGroup.JOURNAL)

ACCEPT = MarkButton("tick", "Accept", "suggestion answer {row_id} accepted")
DECLINE = MarkButton("close", "Decline", "suggestion answer {row_id} declined")
