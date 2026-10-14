import time

REVISIONS, OPEN_UNTIL, REVISION, CHANGE = "revisions", "open_until", "revision", "change"


def count(doc) -> int:
    return int(doc.revisions)


def is_open(doc) -> bool:
    return bool(count(doc)) and time.time() < float(doc.open_until)
