from dataclasses import dataclass

from journal.features.voices.calling import Calling

PLAIN_WORDS = ("The voice shapes only your tone and how you address me. Even in the chat, say worker, subagent, task and environment, "
               "whatever the voice. Code, commit messages, docs, reports and briefs are always in plain language.")


@dataclass(frozen=True)
class Voice:
    """How the agent talks in the chat: its tone, how it addresses the user, its humour, and how it names the agents it sends."""

    name: str
    text: str
    calling: Calling
    sample: str
    humour: str
    naming: str
    address: str | None = None
    """The words the user is called by, for a voice that calls them in its own words."""
    emoji: str | None = None

    def instruction(self, title: str, first_name: str) -> str:
        called = self.calling.called(title, first_name, self.address)
        parts = (self.text, self.calling.instruction(called), self.humour, f"When you name a subagent or a worker: {self.naming}",
                 f"Your own emoji are {self.emoji}: react with them, and now and then use one in what you write." if self.emoji is not None else "", PLAIN_WORDS)
        return " ".join(part for part in parts if part)
