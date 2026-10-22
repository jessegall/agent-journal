import json
import time
from typing import Iterator

from journal.http.support.json_out import JsonOut
from journal.http.support.request import Request
from journal.support.response import Response
from journal.http.support.stream_response import StreamResponse
from journal.models.entry import Entry
from journal.repositories.entries import Entries
from journal.repositories.scope import Scope

AGENT_EVENT_KINDS = frozenset({"SessionStarted", "PromptSubmitted", "ToolStarting", "ToolFinished", "ToolFailed", "Compacting", "Stop", "SessionEnded", "SubagentStarted", "SubagentEnded", "TurnDisplayed",
                  "nudge", "created", "updated", "deleted"})
RECENT_ENTRIES = 100
HEARTBEAT_SECONDS = 15.0


class EntryController:
    """The timeline as the viewer stays live by it: the entries after an id, or the newest; and the same as a stream while a tab is open."""

    def __init__(self, entries: Entries, scope: Scope) -> None:
        self.entries, self.scope = entries, scope

    def index(self, request: Request) -> Response:
        start = int(request.queried("since"))
        if start > self.entries.last_id():
            start = 0
        rows = self.entries.recent_shown(start) if start else list(reversed(self.entries.shown_recent(int(request.queried("last", RECENT_ENTRIES)))))
        return Response.json([entry for entry in rows if entry.kind in AGENT_EVENT_KINDS])

    def stream(self, request: Request) -> StreamResponse:
        environment = self.scope.id

        def read(entries):
            with self.scope.environment(environment):
                return entries()

        def events() -> Iterator[bytes]:
            yield b": open\n\n"
            start_id = request.query.get("since")
            journal_newest = read(self.entries.last_id)
            newest_id, silence_seconds = (min(int(start_id), journal_newest) if start_id else journal_newest), 0.0
            while True:
                time.sleep(0.5)
                silence_seconds += 0.5
                for entry in read(lambda: self.entries.recent_shown(newest_id)):
                    newest_id = entry.id
                    if entry.kind in AGENT_EVENT_KINDS:
                        silence_seconds = 0.0
                        yield self.event(entry)
                if silence_seconds >= HEARTBEAT_SECONDS:
                    silence_seconds = 0.0
                    yield b"event: beat\ndata: keep\n\n"
        return StreamResponse("text/event-stream", events())

    @staticmethod
    def event(entry: Entry) -> bytes:
        return f"id: {entry.id}\ndata: {json.dumps(entry, cls=JsonOut)}\n\n".encode()
