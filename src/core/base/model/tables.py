from core.base.model.model import Model
from core.base.model.table import Table


class Tables:
    """Keeps one Table per model, so each is worked out only once."""

    def __init__(self) -> None:
        self.built: dict[type[Model], Table] = {}

    def table(self, model: type[Model]) -> Table:
        if model not in self.built:
            self.built[model] = Table.build(model)
        return self.built[model]
