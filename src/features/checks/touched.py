from dataclasses import dataclass
from pathlib import Path

from engine.worktree import git

TESTS = ("test.py", "test_*.py", "*_test.py")
SHOWN = 5


@dataclass(frozen=True)
class Covered:
    tests: tuple[str, ...]
    bare: tuple[str, ...]

    @property
    def uncovered(self) -> str:
        more = f" and {len(self.bare) - SHOWN} more" if len(self.bare) > SHOWN else ""
        return ", ".join(self.bare[:SHOWN]) + more


def changed(project: Path) -> list[str]:
    edited = git(project, "diff", "--name-only", "HEAD").stdout.splitlines()
    new = git(project, "ls-files", "--others", "--exclude-standard").stdout.splitlines()
    return list(dict.fromkeys(edited + new))


def nearest(project: Path, path: str) -> list[str]:
    folder = (project / path).parent
    while folder != project and project in folder.parents:
        found = sorted({str(test.relative_to(project)) for pattern in TESTS for test in folder.glob(pattern)})
        if found:
            return found
        folder = folder.parent
    return []


def covering(project: Path, paths: list[str]) -> Covered:
    tests, bare = {}, []
    for path in paths:
        found = nearest(project, path)
        tests.update(dict.fromkeys(found))
        if not found:
            bare.append(path)
    return Covered(tuple(tests), tuple(bare))
