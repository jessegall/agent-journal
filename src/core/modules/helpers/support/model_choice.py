PROFILE_MODEL = "default"


class ModelChoice:
    """The model a helper or worker start names: an exact model, or default for the profile's own, which the
    empty text stands for in the start command."""

    @staticmethod
    def chosen(model: str | None) -> str:
        return "" if model in (None, PROFILE_MODEL) else model
