from dataclasses import dataclass

from journal.support.check_finding import CheckFinding


@dataclass(frozen=True)
class CheckReport:
    """What a check wrote to the file named by JOURNAL_REPORT: a title, a summary, and its findings."""

    title: str = ""
    summary: str = ""
    findings: tuple[CheckFinding, ...] = ()

    @classmethod
    def from_json(cls, data: dict) -> "CheckReport":
        return cls(str(data.get("title", "")), str(data.get("summary", "")), tuple(CheckFinding.from_json(f) for f in data.get("findings", ())))
