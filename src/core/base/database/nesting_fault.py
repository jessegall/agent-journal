class NestingFault(Exception):
    """Commands nested deeper than the limit: a listener is undoing what another does, named by the chain of
    commands that led there."""

    def __init__(self, chain: tuple[str, ...]) -> None:
        super().__init__(f"commands nested {len(chain)} deep: {' > '.join(chain)}")
        self.chain = chain
