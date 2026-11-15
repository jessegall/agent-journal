from engine.errors.refusal import Refusal


class RequiredEffectError(Refusal):
    """A required admission effect failed in a step's save, so the admission is withdrawn and the whole write
    rolls back."""
