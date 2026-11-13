from pathlib import Path


class ProjectCheckouts:
    """The separate checkouts of the project that a suite keeps beside the project folder; the engine keeps none of
    its own, so a suite binds its own answer."""

    def folders(self) -> tuple[Path, ...]:
        return ()
