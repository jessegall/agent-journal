from core.base.change.change import Change
from core.base.model.model import Model


class ChangeFilter:
    """Whether a guard or listener applies to a change; every one does, until a layer above the core binds a
    rule of its own, such as the drivers module applying a driver's guards only to the agents it drives."""

    def applies(self, entry_name: str, change: Change[Model]) -> bool:
        return True
