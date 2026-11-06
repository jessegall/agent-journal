from enum import StrEnum


class LogSource(StrEnum):
    SERVER = "server"
    ERROR = "error"
    JOURNAL = "journal"
