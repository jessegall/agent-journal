from journal.providers.provider import Provider


class Providers:
    """Every provider by name."""

    def __init__(self, *providers: Provider) -> None: ...

    def named(self, name: str) -> Provider: ...

    @classmethod
    def standard(cls) -> "Providers": ...
