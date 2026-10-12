BUTTONED = ("message", "doc", "report")


def of_kind(kind: str, messages, docs, reports):
    """The rows of a kind that can carry buttons, from the three controllers a receiver asked for."""
    return {"message": messages, "doc": docs, "report": reports}[kind]
