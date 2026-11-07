from typing import Any

from core.base.model.table import T, Table


class Tables:
    """Keeps one Table per model or view model, so each is worked out only once."""

    def __init__(self) -> None:
        self.built: dict[type, Table[Any]] = {}

    def table(self, model: type[T]) -> Table[T]:
        if model not in self.built:
            self.built[model] = Table[Any].build(model)
        return self.built[model]
