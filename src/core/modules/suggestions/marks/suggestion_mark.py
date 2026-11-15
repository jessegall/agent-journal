from engine.chat.mark_declaration import MarkDeclaration
from engine.enums.mark_click import MarkClick
from core.modules.suggestions.models.enums.suggestion_mark_type import SuggestionMarkType
from core.modules.suggestions.models.enums.suggestion_mark_variant import SuggestionMarkVariant
from core.modules.suggestions.support.suggestion_marks import ACCEPT
from core.modules.suggestions.support.suggestion_marks import DECLINE
from core.modules.suggestions.support.suggestion_marks import SUGGESTIONS_FAMILY


class SuggestionMark(MarkDeclaration):
    """The mark SuggestionMarkType.SUGGESTION."""

    type = SuggestionMarkType.SUGGESTION
    variants = SuggestionMarkVariant
    family = SUGGESTIONS_FAMILY
    label = "Suggestion"
    mark_icon = "bulb"
    click = MarkClick.OPEN_ROW
    process = True
    buttons = [ACCEPT, DECLINE]
