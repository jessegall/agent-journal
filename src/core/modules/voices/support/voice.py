from dataclasses import dataclass

from core.modules.voices.support.address_form import AddressForm

PLAIN_VOCABULARY = ("The voice shapes only your tone and how you address me. Keep the normal names of agents, tasks and environments in every voice. "
                    "Code, commit messages, docs, reports and briefs are always in plain language.")


@dataclass(frozen=True)
class Voice:
    """How the agent talks in the chat: its tone, how it addresses the user, its humour, and how it names the
    agents it sends."""

    name: str
    text: str
    address_form: AddressForm
    sample: str
    humour: str
    naming: str
    address: str | None = None
    emoji: str | None = None

    def called(self, title: str, first_name: str) -> str:
        return self.address_form.called(title, first_name, self.address)

    def sample_line(self, title: str, first_name: str) -> str:
        return self.sample.replace("{you}", self.called(title, first_name) or "you")

    def instruction(self, title: str, first_name: str) -> str:
        emoji = f"Your own emoji are {self.emoji}: react with them, and now and then use one in what you write." if self.emoji is not None else ""
        parts = (self.text, self.address_form.instruction(self.called(title, first_name)), self.humour, f"When you name an agent: {self.naming}", emoji, PLAIN_VOCABULARY)
        return " ".join(part for part in parts if part)
