from dataclasses import dataclass

from journal.engine.states.wait import Wait
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.engine.support.typist import Typist
from journal.events.agent.ticked import Ticked
from journal.events.agent.turn_failed import TurnFailed
from journal.events.rows.message_arrived import MessageArrived


@dataclass(frozen=True)
class UsageLimited(Wait):
    """The agent's provider refused its turns on a usage limit: the journal types nothing into its terminal, a message from the user pops it with the inbox line, so the message is typed at once, and every so many minutes it pops to try a turn, which pushes it again while the limit holds."""

    name = "limited"
    title = "Usage limit reached"

    limited_at: float = 0.0
    message: str = ""

    def on_enter(self, typist: Typist) -> None:
        typist.clear()
        typist.disable()

    def on_exit(self, typist: Typist) -> None:
        typist.enable()

    def wait_description(self) -> tuple[str, str]:
        return self.message or "the usage limit to reset", ""

    def on_ticked(self, event: Ticked, settings: Settings) -> Transition:
        from journal.features.usage.feature import Usage
        if event.time - self.limited_at < settings.integer(Usage.CHECK_MINUTES) * 60:
            return self.none()
        return self.pop(Usage.LIMIT_CHECK.create())

    def on_message_arrived(self, event: MessageArrived, settings: Settings) -> Transition:
        from journal.features.messages.feature import Messages
        unread = event.data.part(Messages).unread
        return self.pop(Messages.inbox(unread)) if unread else self.pop()

    def on_turn_failed(self, event: TurnFailed, settings: Settings) -> Transition:
        event.stop_propagation()
        return self.swap(UsageLimited(limited_at=event.time, message=event.message)) if event.is_usage_limit() else self.none()
