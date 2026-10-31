import re
from dataclasses import dataclass

from core.base.model.model import Model
from core.base.refusal import Refusal
from core.base.timestamp import Timestamp

TITLE_LIMIT_CHARACTERS = 80
ADDRESS = re.compile(r"^https?://\S+$")
ROW = re.compile(r"^[a-z_]+:\d+$")


@dataclass(frozen=True, kw_only=True)
class Notice(Model):
    """A link pinned above an environment's chat for the person to open on their return: an outside address or a
    row of the journal, with the words on its button, until it is closed."""

    model_name = "notice"
    cli_name = "notice"

    environment_id: int
    creator_id: int
    title: str
    link: str
    label: str = "Open"
    closed_at: Timestamp | None = None

    def __post_init__(self) -> None:
        if not 1 <= len(self.title) <= TITLE_LIMIT_CHARACTERS:
            raise Refusal(f"a title is at most {TITLE_LIMIT_CHARACTERS} characters, this one is {len(self.title)}", "put the rest in what the link opens")
        if not (ADDRESS.match(self.link) or ROW.match(self.link)):
            raise Refusal("a notice links to an address that starts with http, or to a row such as task:12", "give --link one of them")
