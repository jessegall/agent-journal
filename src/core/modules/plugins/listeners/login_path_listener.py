from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from core.modules.plugins.support.login_path import LoginPath
from engine.event.file_publishing import FilePublishing


class LoginPathListener(CommitListener[FilePublishing]):
    """Reads the login shell's PATH anew as the journal starts or an update changes its modules, so no plugin
    hook waits on the shell's start files."""

    name = "plugins.login-path"

    def __init__(self, login_path: LoginPath) -> None:
        self.login_path = login_path

    def handle(self, event: FilePublishing, logged: LoggedEvent) -> None:
        self.login_path.read_shell()
