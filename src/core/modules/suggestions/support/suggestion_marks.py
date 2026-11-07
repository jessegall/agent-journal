from core.base.chat.mark_button import MarkButton
from core.base.chat.mark_click import MarkClick
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.modules.suggestions.models.enums.suggestion_mark_type import SuggestionMarkType
from core.modules.suggestions.models.enums.suggestion_mark_variant import SuggestionMarkVariant

SUGGESTIONS_FAMILY = MarkFamily("suggestions.suggestions", "Suggestions", "bulb", MarkGroup.JOURNAL)

ACCEPT = MarkButton("tick", "Accept the suggestion", "suggestion answer {row_id} accepted")
DECLINE = MarkButton("close", "Decline the suggestion", "suggestion answer {row_id} declined")

SUGGESTION_MARKS = [MarkDeclaration(SuggestionMarkType.SUGGESTION, SuggestionMarkVariant, SUGGESTIONS_FAMILY, "Suggestion", "bulb", click=MarkClick.OPEN_ROW, process=True, buttons=[ACCEPT, DECLINE])]
