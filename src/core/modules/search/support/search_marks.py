from engine.enums.mark_click import MarkClick
from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.enums.mark_group import MarkGroup
from core.modules.search.models.enums.search_mark_type import SearchMarkType
from core.modules.search.models.enums.search_mark_variant import SearchMarkVariant

SEARCHES_FAMILY = MarkFamily("search.searches", "Searches", "search", MarkGroup.AGENT)

SEARCH_MARKS = [MarkDeclaration(SearchMarkType.SEARCH, SearchMarkVariant, SEARCHES_FAMILY, "Search", "search", click=MarkClick.UNFOLD, body="search-mark.js", group_label="{count} searches")]
