from journal.config import Config
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.models.actor import Actor
from journal.models.author import Author
from journal.models.message import Message
from journal.providers.providers import Providers
from journal.repositories.messages import Messages


class KeepThought(AgentListener[ToolStarting]):
    """Before each tool use, every thought of the agent's turn not yet kept is read from its transcript and kept as a message in the chat, marked a thought."""

    def __init__(self, config: Config, providers: Providers, messages: Messages) -> None:
        self.config, self.providers, self.messages = config, providers, messages

    def handle(self, event: ToolStarting) -> None:
        kept = {m.text for m in self.messages.thoughts_of(event.session)}
        written = (t.strip() for t in self.providers.named(event.provider).thoughts_this_turn(self.config.root, event.session))
        for thought in dict.fromkeys(t for t in written if t and t not in kept):
            self.messages.save(Message(author=Author.AGENT, text=thought, data={"kind": Message.THOUGHT}), Actor.agent(event.session))
