from engine.time.clock import Clock
from dataclasses import dataclass, field
from engine.database.reported_findings import ReportedFindings
from engine.journal.journal_home import JournalHome
from engine.provider.transcript_entries import TranscriptEntries
from engine.time.timestamp import Timestamp
from server.handover.code_version import CodeVersion
from server.hook.hook_database import HookDatabase
from server.door.journal_door import JournalDoor
from server.work.listener_thread import ListenerThread
from engine.serving.server_files import ServerFiles
from server.tick.server_tunnel import ServerTunnel
from server.viewer.viewer_endpoint import ViewerEndpoint
from server.request.request_trace import RequestTrace

HOOK_LIMIT_SECONDS = 3.5
STOP_LIMIT_SECONDS = 20.0
AGENT_HOOK_LIMIT_SECONDS = 45.0


@dataclass(frozen=True)
class ServerContext:
    """What every request of one server shares: the journal's folder, the code the server started with, its
    files, when it started, its listener thread, the database connection its hooks share, the viewer's
    listener, the findings of repeated work it has reported (the viewer's lines share them), the door its
    socket's requests pass, how long a hook
    waits for another writer, and how far its hooks have read each session file."""

    home: JournalHome
    code_version: CodeVersion
    files: ServerFiles
    started_at: Timestamp
    listener_thread: ListenerThread
    hook_database: HookDatabase
    viewer: ViewerEndpoint
    tunnel: ServerTunnel
    reported_findings: ReportedFindings
    door: JournalDoor
    hook_limit_seconds: float = HOOK_LIMIT_SECONDS
    agent_hook_limit_seconds: float = AGENT_HOOK_LIMIT_SECONDS
    stop_limit_seconds: float = STOP_LIMIT_SECONDS
    transcript_entries: TranscriptEntries = field(default_factory=TranscriptEntries)
    clock: Clock = field(default_factory=Clock)

    @property
    def request_trace(self) -> RequestTrace:
        return self.viewer.routes.request_trace
