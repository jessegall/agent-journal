from core.base.actor import Actor
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.modules.phone.commands.note_phone_notice import NotePhoneNotice


class PhoneNoticeListener(CommitListener):
    """What the notice listeners share: when something new waits for the person, every paired phone that
    subscribed is marked, and the ticker's round pushes it, so no push service holds the listener thread."""

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: LoggedEvent) -> None:
        self.bus.run(NotePhoneNotice(), Actor.core(), cause_id=event.id, environment_id=event.environment_id)
