class NestingFault(Exception):
    """Raised when commands run inside each other too deeply, usually because two listeners keep triggering each
    other."""

    def __init__(self, chain: tuple[str, ...]) -> None:
        super().__init__(f"commands nested {len(chain)} deep: {' > '.join(chain)}")
        self.chain = chain
