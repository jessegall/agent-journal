from dataclasses import dataclass, field
from datetime import datetime
from typing import ClassVar

from journal.models.author import Author
from journal.models.scoped import Scoped
TYPED = "typed"


@dataclass(frozen=True)
class Message(Scoped):
    text_fields: ClassVar[tuple[str, ...]] = ("text",)

    THOUGHT = "thought"

    author: Author = Author.USER
    text: str = ""
    reply_to: int | None = None
    read_at: datetime | None = None
    idempotency: str = ""
    """The key the sender gave it, so a message sent twice lands once and the viewer can match what it sent."""
    acknowledgement: bool = False
    """An agent's turn that only answered a journal line and changed nothing: kept, and left out of the chat unless shown."""
    files: tuple[str, ...] = ()
    """The names of the files attached, kept under the journal's files folder."""
    captions: dict = field(default_factory=dict)
    """What each attached picture shows, in the agent's words once it has opened it, so it can be found later."""
    data: dict = field(default_factory=dict)
    """Its metadata: a system message's card (its kind, icon, tone, detail, the row it opens and the session it belongs to), an agent's thought (kind thought), or the buttons a message offers and those pressed."""

    @property
    def is_agents_reply(self) -> bool:
        return self.reply_to is not None and self.author == Author.AGENT

    @property
    def quoted_lines(self) -> int:
        """How many lines the quote above a reply takes, the lines starting with > the viewer puts there."""
        lines = self.text.split("\n")
        return next((i for i, line in enumerate(lines) if not line.startswith(">")), len(lines))

    @property
    def own_words(self) -> str:
        """The words without the quote above them."""
        return "\n".join(self.text.split("\n")[self.quoted_lines:]).strip()

    @property
    def is_thought(self) -> bool:
        return self.data.get("kind") == self.THOUGHT

    @property
    def is_typed_in_terminal(self) -> bool:
        return self.data.get("kind") == TYPED

    @property
    def speaks_to_the_user(self) -> bool:
        """The agent's own words in the chat: not a thought, and not a turn that only acknowledged a journal line."""
        return self.author == Author.AGENT and not self.acknowledgement and not self.is_thought

