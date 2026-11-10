from engine.errors.refusal import Refusal


class ExistingRowRefusal(Refusal):
    """A refusal of a row whose unique values another row already has."""
