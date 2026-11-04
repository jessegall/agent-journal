from core.modules.library.support.library_unreachable_error import LibraryUnreachableError


class LibraryAnswer:
    """Takes one named part out of what the shared server answered; an answer without it is unreachable."""

    @staticmethod
    def member(body: object, name: str) -> object:
        if not isinstance(body, dict) or name not in body:
            raise LibraryUnreachableError.unreadable()
        return body[name]

    @staticmethod
    def members(body: object, name: str) -> list[object]:
        part = LibraryAnswer.member(body, name)
        if not isinstance(part, list):
            raise LibraryUnreachableError.unreadable()
        return part
