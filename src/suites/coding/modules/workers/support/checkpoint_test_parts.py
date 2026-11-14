import shlex
from collections.abc import Sequence

NODE_SEPARATOR = "::"


class CheckpointTestParts:
    """Splits a checkpoint's test command into commands of at most the test limit each, by the test files its
    listing names, in their order; a file with more tests than the limit is split by its test names. A command
    within the limit, a listing that names no tests, or a limit of 0 gives the command whole."""

    def __init__(self, command: str, listing: str, limit: int) -> None:
        self.command, self.limit = command, limit
        self.test_names = tuple(line.strip() for line in listing.splitlines() if NODE_SEPARATOR in line)

    def commands(self) -> list[str]:
        if self.limit <= 0 or len(self.test_names) <= self.limit:
            return [self.command]
        files = self.file_tests()
        options = [word for word in shlex.split(self.command) if not any(names_file(word, file) for file in files)]
        return [shlex.join([*options, *selectors]) for selectors in self.selector_groups(files)]

    def file_tests(self) -> dict[str, list[str]]:
        files: dict[str, list[str]] = {}
        for name in self.test_names:
            files.setdefault(name.split(NODE_SEPARATOR)[0], []).append(name)
        return files

    def selector_groups(self, files: dict[str, list[str]]) -> list[list[str]]:
        groups: list[list[str]] = []
        group: list[str] = []
        group_count = 0
        for file, names in files.items():
            if len(names) > self.limit:
                groups.extend(split_names(names, self.limit))
                continue
            if group_count + len(names) > self.limit:
                groups.append(group)
                group, group_count = [], 0
            group.append(file)
            group_count += len(names)
        return [*groups, group] if group else groups


def names_file(word: str, file: str) -> bool:
    path = word.split(NODE_SEPARATOR)[0].rstrip("/")
    return file == path or file.startswith(f"{path}/")


def split_names(names: Sequence[str], size: int) -> list[list[str]]:
    return [list(names[start:start + size]) for start in range(0, len(names), size)]
