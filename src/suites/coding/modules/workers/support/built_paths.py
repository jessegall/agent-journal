from collections.abc import Iterable
from dataclasses import dataclass
from pathlib import PurePosixPath

ANY_FOLDERS = "**"
WILDCARDS = ("*", "?", "[")


@dataclass(frozen=True)
class BuiltPaths:
    """The globs of the files a build makes from sources: a merge never stops on a clash in them, since the build
    makes them again from the merged sources."""

    patterns: tuple[str, ...]

    def holds(self, path: str) -> bool:
        return any(PurePosixPath(path).full_match(pattern) for pattern in self.patterns)

    def of(self, paths: Iterable[str]) -> tuple[str, ...]:
        return tuple(path for path in paths if self.holds(path))

    def others(self, paths: Iterable[str]) -> tuple[str, ...]:
        return tuple(path for path in paths if not self.holds(path))

    # The folders the build writes the built files among these paths into, each once.
    def folders(self, paths: Iterable[str]) -> tuple[str, ...]:
        return tuple(sorted({self.folder(path) for path in self.of(paths)}))

    # The folder of a built file that its pattern names, such as app/web/dist for **/web/dist/**; the file's own folder
    # when the pattern names no folder without wildcards.
    def folder(self, path: str) -> str:
        pattern = next(pattern for pattern in self.patterns if PurePosixPath(path).full_match(pattern))
        matching = [part for part in PurePosixPath(pattern).parts if part != ANY_FOLDERS]
        if not matching or any(wildcard in part for part in matching for wildcard in WILDCARDS):
            return str(PurePosixPath(path).parent)
        literal = "/".join(matching)
        start = f"/{path}".find(f"/{literal}/")
        return path[:start + len(literal)] if start >= 0 else str(PurePosixPath(path).parent)
