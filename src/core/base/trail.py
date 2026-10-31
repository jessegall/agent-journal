import time

TRAIL_HEADER = "Journal-Trail"


class Trail:
    """The named wall clock stamps, in microseconds since 1970, one request collects in order on its way through
    the hook, the client and the server; a run with no trail set keeps no stamps."""

    def __init__(self, stamps: list[tuple[str, int]] | None = None) -> None:
        self.stamps = stamps

    @classmethod
    def parsed(cls, text: str) -> "Trail":
        pairs = (pair.partition("=") for pair in text.split(";") if pair)
        return cls([(name, int(value)) for name, _, value in pairs if name and value.isdigit()])

    def stamp(self, name: str) -> None:
        if self.stamps is not None:
            self.stamps.append((name, time.time_ns() // 1000))

    def text(self) -> str:
        return ";".join(f"{name}={at}" for name, at in self.stamps or [])
