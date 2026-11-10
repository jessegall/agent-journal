from collections.abc import Sequence
from typing import ClassVar

from engine.model.model import Model
from engine.query.model_row_ids import ModelRowIds


class SharedRows:
    """The rows a share link to one row includes, which its module declares: for a plan, its phases and tasks.
    """

    row: ClassVar[type[Model]]

    def rows(self, row_id: int) -> Sequence[ModelRowIds]:
        raise NotImplementedError
