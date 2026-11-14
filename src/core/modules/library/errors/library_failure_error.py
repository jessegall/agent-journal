from engine.errors.refusal import Refusal


class LibraryFailureError(Refusal):
    """A request to the shared server that gave no answer to use, with the reason and what to do."""
