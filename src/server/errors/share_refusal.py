from engine.errors.refusal import Refusal


class ShareRefusal(Refusal):
    """Raised when a share session asks for more than the link shows."""
