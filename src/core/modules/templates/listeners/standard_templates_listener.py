from engine.actor.actor import Actor
from core.base.change.logged_event import LoggedEvent
from engine.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.modules.templates.commands.save_standard_templates.save_standard_templates import SaveStandardTemplates
from core.base.change.file_publishing import FilePublishing


class StandardTemplatesListener(CommitListener[FilePublishing]):
    """As the journal starts or an update changes its modules, writes the templates it ships again."""

    name = "templates.save-standard"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: FilePublishing, logged: LoggedEvent) -> None:
        self.bus.run(SaveStandardTemplates(), Actor.core(), cause_id=logged.id)
