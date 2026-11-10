import inspect
from collections.abc import Callable

INTERNAL_ACCESS = (".container", "monkeypatch", ".database", "Statement(")


class StoryBody:
    """Says whether a story reaches past the commands into the journal's internals, where its path cannot see it."""

    @staticmethod
    def reaches_internals(function: Callable[..., object]) -> bool:
        source = inspect.getsource(function)
        return any(access in source for access in INTERNAL_ACCESS)
