from enum import StrEnum


class PersonFactorType(StrEnum):
    """What a user proves a second time with at login."""

    PASSKEY = "passkey"
    APP_CODE = "app_code"
