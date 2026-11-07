from enum import StrEnum


class SessionType(StrEnum):
    """Who a viewer session acts for: a person at a computer, the person's paired phone, one shared row, or the
    running main agent, which opens the viewer as itself and is refused what only a person may do."""

    PERSON = "person"
    PHONE = "phone"
    SHARE = "share"
    AGENT = "agent"
