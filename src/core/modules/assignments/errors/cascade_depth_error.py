class CascadeDepthError(Exception):
    """The children of an assigned row reach deeper than any declared chain of models can."""

    def __init__(self, model_name: str, level_count: int) -> None:
        super().__init__(f"the children of a {model_name} reach more than {level_count} levels deep: its models assign each other in a loop")
