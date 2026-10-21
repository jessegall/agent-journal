from journal.config import Config
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent.turn_displayed import TurnDisplayed
from journal.events.agent_listener import AgentListener
from journal.events.bus import Bus
from journal.features.messages.listeners.record_turn import REPLY_TAG
from journal.providers.providers import Providers
from journal.repositories.messages import Messages

THOUGHT_PREFIX = "thought:"


class ThoughtReply(AgentListener[ToolStarting]):
    """A reply the agent wrote in its thinking never reaches the chat on its own: a thought opening with a reply tag for a message still unanswered is posted as that reply."""

    def __init__(self, config: Config, providers: Providers, messages: Messages, bus: Bus) -> None:
        self.config, self.providers, self.messages, self.bus = config, providers, messages, bus

    def handle(self, event: ToolStarting) -> None:
        unanswered = {m.id for m in self.messages.unanswered()}
        if not unanswered:
            return
        for thought in self.providers.lookup(event.provider).turn_thoughts(self.config.root, event.session):
            matched = {int(n) for tag in REPLY_TAG.finditer(thought) for n in tag.group(1).split(",")}
            if matched & unanswered:
                turn = TurnDisplayed(text=thought, delta=thought, turn_id=f"{THOUGHT_PREFIX}{hash(thought)}", final=True)
                self.bus.dispatch(turn.placed(event.session, event.environment_id, event.provider, event.context, event.time))
                unanswered -= matched
