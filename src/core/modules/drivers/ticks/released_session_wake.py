from engine.container.container import Container
from engine.journal.journal_home import JournalHome
from engine.serving.server_files import ServerFiles


class ReleasedSessionWake:
    """Once the server is ready again, moves aside the sessions whose hook the journal held while it started or
    updated; the wake owner wakes each of their agents through its boot step."""

    def __call__(self, container: Container) -> None:
        files = ServerFiles(container.get(JournalHome))
        if files.phase().runs_programs:
            files.blocked_sessions().archive()
