from dataclasses import dataclass
from core.base.journal_home import JournalHome
from core.base.timestamp import Timestamp
from server.code_version import CodeVersion
from server.hook.hook_database import HookDatabase
from server.listener_thread import ListenerThread
from server.server_files import ServerFiles
from server.viewer.viewer_listener import ViewerListener

HOOK_LIMIT_SECONDS = 3.0


@dataclass(frozen=True)
class ServerContext:
    """What every request of one server shares: the journal's folder, the code the server started with, its
    files, when it started, its listener thread, the database connection its hooks share, the viewer's
    listener, and how long a hook waits for another writer."""

    home: JournalHome
    code_version: CodeVersion
    files: ServerFiles
    started_at: Timestamp
    listener_thread: ListenerThread
    hook_database: HookDatabase
    viewer: ViewerListener
    hook_limit_seconds: float = HOOK_LIMIT_SECONDS
