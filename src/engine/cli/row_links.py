LINKS_SHOWN = 50


class RowLinks:
    """The lines naming what a shown row links to, at most `limit` of them and leaving out the exceptions; the
    links module binds its own.
    """

    def lines(self, model_name: str, row_id: int, exceptions: tuple[str, ...] = (), limit: int = LINKS_SHOWN) -> list[str]:
        return []
