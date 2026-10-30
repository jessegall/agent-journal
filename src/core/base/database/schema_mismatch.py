class SchemaMismatch(Exception):
    """Models whose fields and tables disagree, each named by model and column."""

    def __init__(self, differences: tuple[str, ...]) -> None:
        super().__init__("the models and their tables disagree: " + "; ".join(differences))
        self.differences = differences
