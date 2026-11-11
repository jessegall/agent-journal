import shlex
from dataclasses import dataclass

from engine.errors.refusal import Refusal

OPTION_MARK = "-"
PATH_MARKS = ("/", ".")


@dataclass(frozen=True)
class OwnTestCommand:
    """A test command as its words, so that only whole test paths can be taken out of it: the program, its
    options and their order stay as they are. A path is a word after the program that names a file or a
    folder; taking out a word that is no path of the command, or every path, is refused."""

    parts: tuple[str, ...]

    @classmethod
    def parse(cls, text: str) -> "OwnTestCommand":
        return cls(tuple(shlex.split(text)))

    def paths(self) -> tuple[str, ...]:
        return tuple(word for word in self.parts[1:] if not word.startswith(OPTION_MARK) and any(mark in word for mark in PATH_MARKS))

    def without(self, paths: tuple[str, ...]) -> "OwnTestCommand":
        command_paths = self.paths()
        unknown = [path for path in paths if path not in command_paths]
        if unknown:
            raise Refusal(f"{', '.join(unknown)} is not a path of the test command", f"its paths are {', '.join(command_paths)}")
        if set(command_paths) <= set(paths):
            raise Refusal("the test command would be left with no path", "a deferral leaves at least one path to run")
        return OwnTestCommand(tuple(word for word in self.parts if word not in paths))

    def with_paths(self, paths: tuple[str, ...]) -> "OwnTestCommand":
        command_paths = self.paths()
        return OwnTestCommand((*(part for part in self.parts if part not in command_paths), *paths))

    def text(self) -> str:
        return shlex.join(self.parts)
