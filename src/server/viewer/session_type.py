from enum import StrEnum


class SessionType(StrEnum):
    """Who a viewer session acts for: a person at a computer, the person's paired phone, or one shared row."""

    PERSON = "person"
    PHONE = "phone"
    SHARE = "share"
