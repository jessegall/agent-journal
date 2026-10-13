EMPTY = {"queue": []}


def current(record) -> dict:
    return record.state("status_bar").get("bar", EMPTY)
