from core.base.change.change import Change
from core.base.model.model import Model


class Applicability:
    """Whether a guard or listener applies to a change; every one does, until a layer above the core binds a
    rule of its own, such as the state machine applying guards only in the states that list them."""

    def applies(self, entry_name: str, change: Change[Model]) -> bool:
        return True
