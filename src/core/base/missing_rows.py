from core.base.refusal import Refusal


class MissingRows(Refusal):
    """Rows asked for by id that do not exist, named by the noun a person types."""

    def __init__(self, cli_noun: str, ids: tuple[int, ...]) -> None:
        super().__init__(f"no {cli_noun} {', '.join(map(str, ids))}", f"journal {cli_noun} list shows what there is")
        self.cli_noun, self.ids = cli_noun, ids
