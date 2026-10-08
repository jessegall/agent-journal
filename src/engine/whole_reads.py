import threading


class WholeReads(threading.local):
    def __init__(self):
        self.reasons: list[str] = []


READS = WholeReads()


def note(why: str) -> None:
    READS.reasons.append(why)


def count() -> int:
    return len(READS.reasons)


def since(mark: int) -> tuple[str, ...]:
    return tuple(READS.reasons[mark:])
