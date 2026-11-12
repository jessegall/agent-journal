from typing import Generic, TypeVar

from engine.model.model import Model

M = TypeVar("M", bound=Model)


class KeptRowChanges(Generic[M]):
    """Keeps a kept read in step with one saved or removed row: a saved row joins the read when the read keeps it,
    and a removed row leaves it. The class that keeps the read says which rows it keeps and how the read changes."""

    def remember(self, row: M) -> None:
        self.update_kept(row, self.kept_rows(row))

    def remove(self, row: M) -> None:
        self.update_kept(row, ())

    def kept_rows(self, row: M) -> tuple[M, ...]:
        return tuple([row])

    def update_kept(self, row: M, kept: tuple[M, ...]) -> None:
        raise NotImplementedError(f"{type(self).__name__} keeps no read to update")
