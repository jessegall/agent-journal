import json
import time
from typing import Iterator

from journal.http.support.json_out import JsonOut
from journal.http.support.request import Request
from journal.support.response import Response
from journal.http.support.stream_response import StreamResponse
from journal.models.entry import Entry
from journal.repositories.entries import Entries
from journal.support.scope import Scope

AGENT_EVENT_KINDS = frozenset({"SessionStarted", "PromptSubmitted", "ToolStarting", "ToolFinished", "ToolFailed", "Compacting", "Stop", "SessionEnded", "SubagentStarted", "SubagentEnded", "TurnDisplayed",
                  "nudge", "created", "updated", "deleted"})
RECENT = 100
HEARTBEAT_SECONDS = 15.0


class EntryController:
    """The timeline as the viewer stays live by it: the entries after an id, or the newest; and the same as a stream while a tab is open."""

    def __init__(self, entries: Entries, scope: Scope) -> None:
        self.entries, self.scope = entries, scope

    def index(self, request: Request) -> Response:
        since = int(request.queried("since"))
        if since > self.entries.last_id():
            since = 0
        rows = self.entries.recent_shown(since) if since else list(reversed(self.entries.shown_recent(int(request.queried("last", RECENT)))))
        return Response.json([entry for entry in rows if entry.kind in AGENT_EVENT_KINDS])

    def stream(self, request: Request) -> StreamResponse:
        environment = self.scope.id

        def read(entries):
            with self.scope.environment(environment):
                return entries()

        def chunks() -> Iterator[bytes]:
            yield b": open\n\n"
            last, quiet = read(self.entries.last_id), 0.0
            while True:
                time.sleep(0.5)
                quiet += 0.5
                for entry in read(lambda: self.entries.recent_shown(last)):
                    last = entry.id
                    if entry.kind in AGENT_EVENT_KINDS:
                        quiet = 0.0
                        yield self.event(entry)
                if quiet >= HEARTBEAT_SECONDS:
                    quiet = 0.0
                    yield b"event: beat\ndata: keep\n\n"
        return StreamResponse("text/event-stream", chunks())

    @staticmethod
    def event(entry: Entry) -> bytes:
        return f"id: {entry.id}\ndata: {json.dumps(entry, cls=JsonOut)}\n\n".encode()
