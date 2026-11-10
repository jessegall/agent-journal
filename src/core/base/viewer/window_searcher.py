from collections.abc import Sequence

from core.base.model.model import Model
from engine.row.page import Page


class WindowSearcher:
    """The function a window declares for its search: from the terms typed to the rows found."""

    def found(self, terms: Sequence[str]) -> Page[Model]:
        raise NotImplementedError
