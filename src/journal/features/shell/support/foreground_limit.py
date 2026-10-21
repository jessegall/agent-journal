from journal.repositories.messages import Messages
from journal.repositories.setting_rows import SettingRows
from journal.support.announced_commands import AnnouncedCommands
from journal.support.chain import Chain


class ForegroundLimit:
    """How many seconds a line may run in the foreground before the rest moves to the background: none for a line of journal commands or a command a subagent announced, fewer while the user waits on a message."""

    def __init__(self, settings: SettingRows, messages: Messages, announced: AnnouncedCommands) -> None:
        self.settings, self.messages, self.announced = settings, messages, announced

    def build(self, line: str, environment: str) -> int:
        from journal.features.shell.feature import Shell
        if Chain.is_journal_line(line) or self.announced.is_announced(environment, tuple(Chain.self_parts(line))):
            return 0
        waiting = bool(self.messages.unread())
        return int(self.settings.option(Shell.MESSAGE_FOREGROUND_LIMIT if waiting else Shell.FOREGROUND))
