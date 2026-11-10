class SchemaMismatchError(Exception):
    """Raised when a model's fields and its database table do not match."""

    def __init__(self, differences: tuple[str, ...]) -> None:
        super().__init__("the models and their tables disagree: " + "; ".join(differences))
        self.differences = differences
