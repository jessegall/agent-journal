from engine.time.clock import Clock
from dataclasses import dataclass, field
from engine.database.reported_findings import ReportedFindings
from engine.journal.journal_home import JournalHome
from engine.provider.transcript_entries import TranscriptEntries
from engine.time.timestamp import Timestamp
from server.handover.code_version import CodeVersion
from server.hook.hook_database import HookDatabase
from server.hook.hook_limits import AGENT_HOOK_LIMIT_SECONDS, HOOK_LIMIT_SECONDS, STOP_LIMIT_SECONDS
from server.door.journal_door import JournalDoor
from server.work.listeners.listener_wake_router import ListenerWakeRouter
from engine.serving.server_files import ServerFiles
from server.tick.server_tunnel import ServerTunnel
from server.viewer.viewer_endpoint import ViewerEndpoint
from server.viewer.request_trace import RequestTrace

# a client that keeps its connection and sends nothing more is let go; a running request is never cut
IDLE_CONNECTION_SECONDS = 30


@dataclass(frozen=True)
class ServerContext:
    """What every request of one server shares: the journal's folder, the code the server started with, its
    files, when it started, the wakes of its listener threads, the database connection its hooks share, the viewer's
    listener, the findings of repeated work it has reported (the viewer's lines share them), the door its
    socket's requests pass, how long a hook
    waits for another writer, how far its hooks have read each session file, and how long a kept connection may
    sit idle before the server closes it."""

    home: JournalHome
    code_version: CodeVersion
    files: ServerFiles
    started_at: Timestamp
    listener_wakes: ListenerWakeRouter
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
    idle_connection_seconds: float = IDLE_CONNECTION_SECONDS

    @property
    def request_trace(self) -> RequestTrace:
        return self.viewer.routes.request_trace
