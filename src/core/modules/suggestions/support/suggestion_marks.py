from engine.chat.mark_button import MarkButton
from engine.chat.mark_click import MarkClick
from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.chat.mark_group import MarkGroup
from core.modules.suggestions.models.enums.suggestion_mark_type import SuggestionMarkType
from core.modules.suggestions.models.enums.suggestion_mark_variant import SuggestionMarkVariant

SUGGESTIONS_FAMILY = MarkFamily("suggestions.suggestions", "Suggestions", "bulb", MarkGroup.JOURNAL)

ACCEPT = MarkButton("tick", "Accept", "suggestion answer {row_id} accepted")
DECLINE = MarkButton("close", "Decline", "suggestion answer {row_id} declined")

SUGGESTION_MARKS = [MarkDeclaration(SuggestionMarkType.SUGGESTION, SuggestionMarkVariant, SUGGESTIONS_FAMILY, "Suggestion", "bulb", click=MarkClick.OPEN_ROW, process=True, buttons=[ACCEPT, DECLINE])]
