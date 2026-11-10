from engine.actor.actor import Actor
from engine.change.logged_event import LoggedEvent
from engine.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.modules.phone.commands.note_phone_notice.note_phone_notice import NotePhoneNotice
from engine.change.event_subscriber import E


class PhoneNoticeListener(CommitListener[E]):
    """What the notice listeners share: when something new waits for the person, every paired phone that
    subscribed is marked, and the ticker's round pushes it, so no push service holds the listener thread."""

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: E, logged: LoggedEvent) -> None:
        self.bus.run(NotePhoneNotice(), Actor.core(), cause_id=logged.id)
