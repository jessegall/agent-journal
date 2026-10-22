from dataclasses import dataclass


@dataclass(frozen=True)
class WorkerOutcome:
    """What a headless run of a program left: its report, the session it ran in, and the error it ended on, empty when it ended well."""

    report: str
    session: str = ""
    error: str = ""
