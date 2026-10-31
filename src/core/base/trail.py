import time

TRAIL_HEADER = "Journal-Trail"


class Trail:
    """The named wall clock stamps, in microseconds since 1970, one request collects in order on its way through
    the hook, the client and the server; a trail with no stamps belongs to no request, so it stays empty."""

    def __init__(self, stamps: tuple[tuple[str, int], ...] = ()) -> None:
        self.stamps = list(stamps)

    @classmethod
    def started(cls, name: str) -> "Trail":
        return cls(((name, time.time_ns() // 1000),))

    @classmethod
    def parsed(cls, text: str) -> "Trail":
        pairs = (pair.partition("=") for pair in text.split(";") if pair)
        return cls(tuple((name, int(value)) for name, _, value in pairs if name and value.isdigit()))

    def stamp(self, name: str) -> None:
        if self.stamps:
            self.stamps.append((name, time.time_ns() // 1000))

    def request_id(self, sender_pid: int) -> str:
        go_start = next((at for name, at in self.stamps if name == "go_start"), None)
        return "" if go_start is None else f"{sender_pid}-{go_start}"

    def joined(self, later: "Trail") -> "Trail":
        return Trail((*self.stamps, *later.stamps))

    def text(self) -> str:
        return ";".join(f"{name}={at}" for name, at in self.stamps)
