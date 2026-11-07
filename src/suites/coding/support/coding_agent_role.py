from enum import StrEnum


class CodingAgentRole(StrEnum):
    """The roles used by the coding suite's drivers."""

    MAIN = "main"
    WORKER = "worker"
    HELPER = "helper"
    REVIEWER = "reviewer"
    VERIFIER = "verifier"
