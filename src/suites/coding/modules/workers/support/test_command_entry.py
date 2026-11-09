import re
from collections.abc import Sequence
from dataclasses import dataclass

from engine.errors.refusal import Refusal

NAME_PATTERN = re.compile(r"[a-z]+(-[a-z]+)*")
EXAMPLE = "--test-command python=pytest"
TEST_COMMAND_EXAMPLE = f"name each with {EXAMPLE}"


@dataclass(frozen=True)
class TestCommandEntry:
    """A test command with the name a worker calls it by, as a dispatch writes it: name=command."""

    name: str
    command: str

    @classmethod
    def parsed(cls, values: Sequence[str]) -> tuple["TestCommandEntry", ...]:
        commands = tuple(cls.parsed_value(value) for value in values)
        names = [entry.name for entry in commands]
        if len(set(names)) < len(names):
            raise Refusal("a test command name appears twice", "give each name once")
        if len({entry.command for entry in commands}) < len(commands):
            raise Refusal("two entries hold one command", "give each command one name")
        return commands

    @classmethod
    def parsed_value(cls, value: str) -> "TestCommandEntry":
        name, separator, command = value.partition("=")
        if not separator:
            raise Refusal(f"{value} is no name=command", EXAMPLE)
        if not NAME_PATTERN.fullmatch(name):
            raise Refusal(f"{name} is no lowercase word", EXAMPLE)
        if not command.strip():
            raise Refusal(f"{name} has an empty command", EXAMPLE)
        return cls(name, command.strip())
