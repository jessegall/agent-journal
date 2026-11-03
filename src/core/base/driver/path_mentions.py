import re

FILE_PATH = re.compile(r"[\w./-]*\w\.[A-Za-z]{1,8}\b")


class PathMentions:
    """The file paths a text names, compared by what they end in, so src/cart.py and cart.py count as one file."""

    @staticmethod
    def found(text: str) -> frozenset[str]:
        return frozenset(FILE_PATH.findall(text))

    @staticmethod
    def shared(paths: frozenset[str], other_paths: frozenset[str]) -> frozenset[str]:
        return frozenset(path for path in paths if any(PathMentions.same_file(path, other_path) for other_path in other_paths))

    @staticmethod
    def same_file(path: str, other_path: str) -> bool:
        return path == other_path or path.endswith(f"/{other_path}") or other_path.endswith(f"/{path}")
