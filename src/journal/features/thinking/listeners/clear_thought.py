from journal.events.agent.turn_written import TurnWritten
from journal.features.agent_listener import AgentListener
from journal.features.thinking.listeners.reply_from_thought import FROM_THOUGHT
from journal.features.thinking.thoughts import Thoughts


class ClearThought(AgentListener[TurnWritten]):
    """A visible message clears the thought in the working bubble."""

    def __init__(self, thoughts: Thoughts) -> None:
        self.thoughts = thoughts

    def handle(self, event: TurnWritten) -> None:
        if event.final and not event.turn_id.startswith(FROM_THOUGHT):
            self.thoughts.clear(event.session)
