from core.base.change.event_log import JOURNAL_BOOTING_EVENT
from core.base.change.logged_event import LoggedEvent
from core.base.journal_home import JournalHome
from core.base.listener.commit_listener import CommitListener
from core.modules.plugins.support.login_path import LoginPath


class LoginPathListener(CommitListener):
    """Reads the login shell's PATH anew as the journal boots, so no plugin hook waits on the shell's start files."""

    name = "plugins.login-path"
    event = JOURNAL_BOOTING_EVENT

    def __init__(self, home: JournalHome) -> None:
        self.login_path = LoginPath(home)

    def handle(self, event: LoggedEvent) -> None:
        self.login_path.read_shell()
