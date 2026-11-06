from contextlib import AbstractContextManager, nullcontext


class RequestWatch:
    """Watches one live request for repeated work. This one watches nothing; a module with a setting for it
    replaces it with one that follows the setting."""

    def watching(self, argv: list[str]) -> AbstractContextManager[None]:
        return nullcontext()

    def report_repeated_lines(self, window: str, line: str, count: int) -> None:
        return None
