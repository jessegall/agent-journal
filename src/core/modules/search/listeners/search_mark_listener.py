import json

from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.search.models.enums.search_mark_type import SearchMarkType
from core.modules.search.models.enums.search_mark_variant import SearchMarkVariant
from core.modules.search.support.row_search import RowSearch
from core.modules.search.support.search_line import SearchLine

SHOWN_HITS = 10


class SearchMarkListener(MarkListener):
    """When a part of an agent's shell line runs journal search find, the chat shows one mark for it: its terms
    and how many rows held them, which opens to the first ten of them, the rows themselves, and a last line
    that opens the search page. The run of the search itself holds its words and is not counted."""

    name = "search.search-mark"
    event = "process_part.create"
    module_name = "journal.core.search"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, search: RowSearch) -> None:
        super().__init__(bus, actors, queries)
        self.search = search

    def handle(self, event: LoggedEvent) -> None:
        part = self.queries.query(ProcessPart).find(event.row_id)
        line = SearchLine.parsed(part.text)
        if line is None:
            return
        run = self.queries.query(Process).find(part.process_id)
        try:
            outcome = self.search.result(line.terms, line.models)
        except Refusal:
            return
        matching_hits = [hit for hit in outcome.hits if (hit.cli_name, hit.row_id) != (Process.cli_name, run.id)]
        total = outcome.total - (len(outcome.hits) - len(matching_hits))
        hits = [{"cli_name": hit.cli_name, "id": hit.row_id, "excerpt": hit.excerpt} for hit in matching_hits[:SHOWN_HITS]]
        detail = json.dumps({"terms": list(line.terms), "total": total, "hits": hits})
        row_count = f"{total} {'row' if total == 1 else 'rows'}"
        self.show(event, SearchMarkType.SEARCH, SearchMarkVariant.MATCHED, f"Searched for {' '.join(line.terms)}: {row_count}", run.environment_id, run.agent_id, detail=detail)
