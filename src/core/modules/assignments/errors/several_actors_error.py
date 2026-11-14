class SeveralActorsError(Exception):
    """The one actor of a row was asked of a model whose rows several actors can hold."""

    def __init__(self, subject_model: str) -> None:
        super().__init__(f"a {subject_model} can be assigned to several actors: read them all")
