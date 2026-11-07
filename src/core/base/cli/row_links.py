class RowLinks:
    """The lines naming what a shown row links to, leaving out the exceptions; the links module binds its own.
    """

    def lines(self, model_name: str, row_id: int, exceptions: tuple[str, ...] = ()) -> list[str]:
        return []
