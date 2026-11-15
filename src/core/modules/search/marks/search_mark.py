from engine.chat.mark_declaration import MarkDeclaration
from engine.enums.mark_click import MarkClick
from core.modules.search.models.enums.search_mark_type import SearchMarkType
from core.modules.search.models.enums.search_mark_variant import SearchMarkVariant
from core.modules.search.support.search_marks import SEARCHES_FAMILY


class SearchMark(MarkDeclaration):
    """The mark SearchMarkType.SEARCH."""

    type = SearchMarkType.SEARCH
    variants = SearchMarkVariant
    family = SEARCHES_FAMILY
    label = "Search"
    mark_icon = "search"
    click = MarkClick.UNFOLD
    body = "search-mark.js"
    group_label = "{count} searches"
