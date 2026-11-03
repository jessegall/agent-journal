from core.base.actor import Actor
from core.base.change.event_log import FILE_PUBLISHING_EVENTS
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.modules.templates.commands.save_standard_templates.save_standard_templates import SaveStandardTemplates


class StandardTemplatesListener(CommitListener):
    """As the journal starts or an update changes its modules, writes the templates it ships again."""

    name = "templates.save-standard"
    event = FILE_PUBLISHING_EVENTS

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: LoggedEvent) -> None:
        self.bus.run(SaveStandardTemplates(), Actor.core(), cause_id=event.id, environment_id=event.environment_id)
