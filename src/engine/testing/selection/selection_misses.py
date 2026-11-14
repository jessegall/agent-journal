from collections.abc import Iterable
from dataclasses import dataclass
from pathlib import PurePosixPath


@dataclass(frozen=True)
class SelectionMisses:
    """The tests that failed in a full run although the selector, asked about the change since the last map,
    would not have chosen them: an argument chooses the test it names, or every test under the file or folder
    it names."""

    arguments: tuple[str, ...]

    def missed(self, failed: Iterable[str]) -> list[str]:
        return sorted(test for test in failed if not any(self.chooses(argument, test) for argument in self.arguments))

    @staticmethod
    def chooses(argument: str, test: str) -> bool:
        path = test.split("::", 1)[0]
        return test == argument or path == argument or PurePosixPath(path).is_relative_to(argument)
