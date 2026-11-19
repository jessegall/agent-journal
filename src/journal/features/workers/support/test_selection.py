import shlex
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class TestSelection:
    """The arguments a worker names its tests with, as the project's test command takes them: whether they name any test, an option or a folder alone running the whole suite, the project folder they may lead with, the folders and globs among them, and the arguments another list has that they lack."""

    arguments: tuple[str, ...]

    @classmethod
    def parsed(cls, arguments: str) -> "TestSelection":
        return cls(tuple(shlex.split(arguments)))

    @classmethod
    def listed(cls, text: str) -> "TestSelection":
        return cls(tuple(line.strip() for line in text.splitlines() if line.strip()))

    def names_tests(self, folder: Path) -> bool:
        return any(not argument.startswith("-") and not (folder / argument).is_dir() for argument in self.arguments)

    def project(self, folder: Path) -> tuple[str, ...]:
        """The leading folder that holds the tests named after it, as a workspace's test script takes the project to run them in."""
        if len(self.arguments) < 2 or not (folder / self.arguments[0]).is_dir():
            return ()
        place = folder / self.arguments[0]
        return self.arguments[:1] if any((place / argument.split("::")[0]).exists() for argument in self.arguments[1:]) else ()

    def tests(self, folder: Path) -> tuple[str, ...]:
        return self.arguments[len(self.project(folder)):]

    def folders(self, folder: Path) -> tuple[str, ...]:
        base = folder.joinpath(*self.project(folder))
        return tuple(argument for argument in self.tests(folder) if not argument.startswith("-") and ((base / argument.split("::")[0]).is_dir() or any(mark in argument for mark in "*?[")))

    def missing(self, selection: "TestSelection") -> tuple[str, ...]:
        return tuple(argument for argument in selection.arguments if argument not in self.arguments)
