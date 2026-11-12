import re
import shlex
from collections.abc import Sequence
from dataclasses import dataclass

from engine.enums.command_category import CommandCategory
from engine.model.model import Model
from engine.errors.refusal import Refusal
from engine.time.timestamp import Timestamp

ARGS_MARK = "{args}"
NAME_PATTERN = re.compile(r"^[a-z0-9][a-z0-9-]*$")
VARIABLE_SEPARATOR = "="


@dataclass(frozen=True, kw_only=True)
class Alias(Model):
    """A word of the project's own for a shell line: `journal <name> [args]` runs the line with the arguments
    in place of {args}, or after it, with its variables set; its reader reads the output, and a background
    one moves to the background at once, and one with a category is held to the turn of that type of
    command, such as a long-running type. A saved command whose run printed nothing for 30 seconds is silent_at
    that moment and held: its next run is refused until its line is edited (fixed_at), and the mark clears
    when a run of the edited line prints."""

    model_name = "alias"
    cli_name = "alias"
    search_fields = ["name", "line", "description"]

    creator_id: int
    name: str
    line: str
    reader_id: int | None = None
    description: str = ""
    variables: tuple[str, ...] = ()
    background: bool = False
    agent_access: bool = False
    plugin_id: int | None = None
    category: CommandCategory | None = None
    silent_at: Timestamp | None = None
    fixed_at: Timestamp | None = None

    @property
    def is_claimed(self) -> bool:
        return self.silent_at is not None and self.fixed_at is None

    def __post_init__(self) -> None:
        if not NAME_PATTERN.match(self.name):
            raise Refusal("an alias name is lower-case letters, digits and dashes, starting with a letter or digit", "pick another name")
        for variable in self.variables:
            if VARIABLE_SEPARATOR not in variable:
                raise Refusal(f"a variable is {variable}=value, not {variable}", "give each --env as NAME=value")

    def begins(self, command: str) -> bool:
        return command.startswith(self.line.replace(ARGS_MARK, "").strip())

    def shell_line(self, arguments: Sequence[str]) -> str:
        quoted = shlex.join(arguments)
        return self.line.replace(ARGS_MARK, quoted) if ARGS_MARK in self.line else f"{self.line} {quoted}".rstrip()

    def variable_values(self) -> dict[str, str]:
        return dict(variable.split(VARIABLE_SEPARATOR, 1) for variable in self.variables)
