import re
from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.base.timestamp import Timestamp

PIN_TITLE_LIMIT_CHARACTERS = 80
ADDRESS = re.compile(r"^https?://\S+$")
ROW = re.compile(r"^[a-z_]+:\d+$")
COMMAND = re.compile(r"^!\s*\S")


@dataclass(frozen=True, kw_only=True)
class Pin(EnvironmentScoped, Model):
    """A link pinned above an environment's chat for the person to open on their return: an outside address, a
    row of the journal or a command written ! <command> that its button runs in the agent's terminal, with the
    words on its button, until it is closed."""

    model_name = "pin"
    cli_name = "pin"
    search_fields = ["title"]

    environment_id: int = 0
    creator_id: int
    title: str
    link: str
    label: str = "Open"
    closed_at: Timestamp | None = None

    def __post_init__(self) -> None:
        if not 1 <= len(self.title) <= PIN_TITLE_LIMIT_CHARACTERS:
            raise Refusal(f"a title is at most {PIN_TITLE_LIMIT_CHARACTERS} characters, this one is {len(self.title)}", "put the rest in what the link opens")
        if not (ADDRESS.match(self.link) or ROW.match(self.link) or COMMAND.match(self.link)):
            raise Refusal("a pin links to an address that starts with http, or to a row such as task:12, or to a command that starts with !", "give --link one of them")
