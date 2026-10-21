import shlex
from dataclasses import dataclass, field

from journal.models.model import Model
from journal.support.part import Part

ARGS = "{args}"


@dataclass(frozen=True)
class Alias(Model):
    """A name for a command line of the project, run as journal <name> with its arguments passed on: the line, the reader that reads its output, what it does, the variables put before it, and the plugin that shipped it, empty for one the agent or the user made."""

    name: str = ""
    line: str = ""
    reader: str = ""
    description: str = ""
    variables: dict = field(default_factory=dict)
    plugin: str = ""

    def command(self, args: str) -> str:
        assignments = " ".join(f"{key}={shlex.quote(str(value))}" for key, value in self.variables.items())
        line = self.line.replace(ARGS, args) if ARGS in self.line else f"{self.line} {args}"
        return f"{assignments} {line}".strip()

    def terminal_line(self, argv: list[str]) -> str:
        return self.command(" ".join(shlex.quote(word) for word in argv))

    def matches(self, part: str) -> bool:
        head, tokens = Part(self.line.split(ARGS)[0]).tokens(), Part(part).tokens()
        return bool(head) and len(tokens) >= len(head) and tokens[0].rsplit("/", 1)[-1] == head[0].rsplit("/", 1)[-1] and tokens[1:len(head)] == head[1:]
