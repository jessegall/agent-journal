class NestingError(Exception):
    """Raised when commands run inside each other past the nesting limit, usually because two listeners keep
    triggering each other."""

    def __init__(self, chain: tuple[str, ...]) -> None:
        super().__init__(f"commands nested {len(chain)} levels: {' > '.join(chain)}")
        self.chain = chain
