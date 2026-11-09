from collections.abc import Sequence
from core.base.refusal import Refusal


class MissingRowsError(Refusal):
    """Raised when rows asked for by id do not exist."""

    def __init__(self, cli_name: str, ids: Sequence[int]) -> None:
        super().__init__(f"no {cli_name} {', '.join(map(str, ids))}", f"journal {cli_name} list shows what there is")
        self.cli_name, self.ids = cli_name, ids
