import json

from core.base.change.event_log import FILE_PUBLISHING_EVENTS
from core.base.change.logged_event import LoggedEvent
from core.base.journal_home import JournalHome
from core.base.listener.commit_listener import CommitListener
from core.modules.aliases.queries.alias_query import AliasQuery

ALIAS_EVENT_PREFIX = "alias."


class AliasFileListener(CommitListener):
    """Writes each alias's shell line to a file, since the Go hook classifies a line before it can ask the journal
    anything, and judges an alias by the command under it."""

    name = "aliases.alias-file"
    event = "*.*"

    def __init__(self, aliases: AliasQuery, home: JournalHome) -> None:
        self.aliases, self.home = aliases, home

    def handle(self, event: LoggedEvent) -> None:
        if event.event not in FILE_PUBLISHING_EVENTS and not event.event.startswith(ALIAS_EVENT_PREFIX):
            return
        lines = {alias.name: alias.line for alias in self.aliases.all_rows()}
        self.home.alias_file.write_text(json.dumps(lines))
