class UnboundedSearchError(Exception):
    """Raised for a glob pattern with **, which searches every level below a folder: a search that goes deeper than
    one folder goes through FileAccess.rglob or walk, with the depth it needs."""

    def __init__(self, pattern: str) -> None:
        super().__init__(f"the glob pattern {pattern} searches without a depth: use FileAccess.rglob with a depth")
        self.pattern = pattern
