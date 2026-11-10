from enum import StrEnum


class LogSource(StrEnum):
    SERVER = "server"
    JOURNAL = "journal"
    BYPASS = "bypass"
