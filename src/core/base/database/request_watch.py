from contextlib import AbstractContextManager, nullcontext

from core.base.database.repeated_lines import RepeatedLines


class RequestWatch:
    """Watches one live request for repeated work. This one watches nothing; a module with a setting for it
    replaces it with one that follows the setting. A hook and a viewer line are watched without refusal: a
    read over the read limit is reported when the request ends and the request finishes."""

    def watching(self, argv: list[str]) -> AbstractContextManager[None]:
        return nullcontext()

    def watching_without_refusal(self, argv: list[str]) -> AbstractContextManager[None]:
        return nullcontext()

    def report_repeated_lines(self, repeated: RepeatedLines) -> None:
        return None
