from core.base.actor import Actor
from core.base.change.event_log import FILE_PUBLISHING_EVENTS
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.modules.sequences.commands.save_standard_sequences.save_standard_sequences import SaveStandardSequences


class StandardSequencesListener(CommitListener):
    """As the journal starts or an update changes its modules, writes the sequences it ships again."""

    name = "sequences.save-standard"
    event = "*.*"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: LoggedEvent) -> None:
        if event.event in FILE_PUBLISHING_EVENTS:
            self.bus.run(SaveStandardSequences(), Actor.core(), cause_id=event.id, environment_id=event.environment_id)
