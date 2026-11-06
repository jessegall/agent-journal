import re
import shlex
from pathlib import Path

from core.base.cli.shell_aliases import ShellAliases
from core.modules.processes.support.background_commands import JOURNAL

INTERPRETER = re.compile(r"python[\d.]*")
MODULE_FLAG = "-m"


class TestRequestIdentity:
    """What a test command runs, written one way: pytest, python3 -m pytest and a saved command of either are the
    same program on the same targets, whatever the interpreter or the options a saved command adds."""

    __test__ = False

    def __init__(self, aliases: ShellAliases) -> None:
        self.aliases = aliases

    def of(self, command: str) -> str:
        try:
            tokens = shlex.split(command)
        except ValueError:
            return command
        if len(tokens) > 1 and tokens[0] == JOURNAL:
            saved = self.saved_command(tokens[1:])
            if saved is not None:
                return saved
        return self.written(self.without_interpreter(tokens))

    def saved_command(self, arguments: list[str]) -> str | None:
        line, base = self.aliases.named_line(arguments), self.aliases.named_line(arguments[:1])
        if line is None or base is None:
            return None
        base_tokens, given = self.without_interpreter(shlex.split(base)), shlex.split(line)
        for token in self.options_of(base_tokens):
            if token in given:
                given.remove(token)
        return self.written(self.without_interpreter(given))

    @classmethod
    def options_of(cls, tokens: list[str]) -> list[str]:
        """The options a saved command adds, each with its value when the word after it is no path or test."""
        options: list[str] = []
        for position, token in enumerate(tokens[1:], 1):
            follows_option = tokens[position - 1].startswith("-") and "=" not in tokens[position - 1]
            if token.startswith("-") or (follows_option and not cls.is_target(token)):
                options.append(token)
        return options

    @staticmethod
    def is_target(token: str) -> bool:
        return "/" in token or "." in token or "::" in token

    @staticmethod
    def without_interpreter(tokens: list[str]) -> list[str]:
        is_module_run = len(tokens) > 2 and INTERPRETER.fullmatch(Path(tokens[0]).name) is not None and tokens[1] == MODULE_FLAG
        return tokens[2:] if is_module_run else tokens

    @staticmethod
    def written(tokens: list[str]) -> str:
        return shlex.join([Path(tokens[0]).name, *tokens[1:]]) if tokens else ""
