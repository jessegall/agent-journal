import re

FILE_PATH = re.compile(r"[\w./-]*\w\.[A-Za-z]{1,8}\b")


class PathMentions:
    """The file paths a text names, compared by what they end in, so src/cart.py and cart.py count as one file."""

    @staticmethod
    def found(text: str) -> frozenset[str]:
        return frozenset(FILE_PATH.findall(text))

    @staticmethod
    def overlap(paths: frozenset[str], compared_paths: frozenset[str]) -> frozenset[str]:
        return frozenset(path for path in paths if any(PathMentions.same_file(path, compared) for compared in compared_paths))

    @staticmethod
    def same_file(path: str, compared_path: str) -> bool:
        return path == compared_path or path.endswith(f"/{compared_path}") or compared_path.endswith(f"/{path}")
