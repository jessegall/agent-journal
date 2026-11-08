from enum import StrEnum


class PrivateDataKind(StrEnum):
    """What kind of private data a finding is; a finding names the kind, never the text."""

    EMAIL = "an email address"
    HOME_PATH = "a home folder path of a real user"
    SESSION_ID = "a session id"
    TOKEN = "a token"
    KEY = "a private key"
    TRANSCRIPT = "message or transcript text"
    RECORDING = "a recording not marked sanitised"
