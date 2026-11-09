from engine.errors.refusal import Refusal


class BlockRefusal(Refusal):
    """Stops an action until its required condition is met."""
