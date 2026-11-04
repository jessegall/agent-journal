from core.base.refusal import Refusal


class LibraryFailure(Refusal):
    """A request to the shared server that gave no answer to use, with the reason and what to do."""
