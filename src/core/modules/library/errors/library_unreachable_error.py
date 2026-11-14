from engine.errors.refusal import Refusal
from core.modules.library.errors.library_failure_error import LibraryFailureError


class LibraryUnreachableError(LibraryFailureError):
    """The server gave no answer that can be read: nothing changes and the next round tries again."""

    def address_refusal(self, address: str) -> Refusal:
        return Refusal(f"The library cannot be reached at {address}.", self.reason)

    @classmethod
    def unreadable_page(cls, code: int) -> "LibraryUnreachableError":
        return cls(f"The server answered {code} with something that is not JSON.")

    @classmethod
    def unreadable(cls) -> "LibraryUnreachableError":
        return cls("The server's answer has not the fields this journal reads.")
