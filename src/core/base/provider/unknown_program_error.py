from core.base.refusal import Refusal


class UnknownProgramError(Refusal):
    """A hook or an agent row names an agent program no installed module provides."""
