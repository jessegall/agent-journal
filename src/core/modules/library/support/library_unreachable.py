from core.modules.library.support.library_failure import LibraryFailure


class LibraryUnreachable(LibraryFailure):
    """The server gave no answer that can be read: nothing changes and the next round tries again."""

    @classmethod
    def unreadable_page(cls, code: int) -> "LibraryUnreachable":
        return cls(f"The server answered {code} with something that is not JSON.")

    @classmethod
    def unreadable(cls) -> "LibraryUnreachable":
        return cls("The server's answer has not the fields this journal reads.")
