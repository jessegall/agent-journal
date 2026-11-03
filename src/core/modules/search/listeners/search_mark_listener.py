import json

from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.driver.hook_event_name import HookEventName
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.drivers.models.hook_call import HookCall
from core.modules.search.models.enums.search_mark_type import SearchMarkType
from core.modules.search.models.enums.search_mark_variant import SearchMarkVariant
from core.modules.search.support.row_search import RowSearch
from core.modules.search.support.search_line import SearchLine

SHOWN_HITS = 10


class SearchMarkListener(MarkListener):
    """When an agent runs journal search find, the chat shows one mark for it: its terms and how many rows
    held them, which opens to the first ten of them, the rows themselves, and a last line that opens the
    search page."""

    name = "search.search-mark"
    event = "hook_call.create"
    module_name = "journal.core.search"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, search: RowSearch) -> None:
        super().__init__(bus, actors, queries)
        self.search = search

    def handle(self, event: LoggedEvent) -> None:
        call = self.queries.query(HookCall).find(event.row_id)
        line = SearchLine.parsed(call.summary) if call.hook == HookEventName.PRE_TOOL_USE else None
        if line is None:
            return
        try:
            outcome = self.search.result(line.terms, line.models)
        except Refusal:
            return
        hits = [{"cli_name": hit.cli_name, "id": hit.row_id, "excerpt": hit.excerpt} for hit in outcome.hits[:SHOWN_HITS]]
        detail = json.dumps({"terms": list(line.terms), "total": outcome.total, "hits": hits})
        row_count = f"{outcome.total} {'row' if outcome.total == 1 else 'rows'}"
        self.show(event, SearchMarkType.SEARCH, SearchMarkVariant.MATCHED, f"Searched for {' '.join(line.terms)}: {row_count}", call.environment_id, call.agent_id, detail=detail)
