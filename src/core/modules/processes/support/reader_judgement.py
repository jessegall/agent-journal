from dataclasses import dataclass

from core.modules.processes.models.enums.reason_code import ReasonCode

MISSED_REASONS = (("--lines picked none", ReasonCode.LINES_MISSED), ("--lines picked nearly all", ReasonCode.TOO_WIDE),
                  ("--summary found nothing", ReasonCode.SUMMARY_MISSING), ("--progress found", ReasonCode.PROGRESS_MISSING),
                  ("--count found nothing", ReasonCode.COUNT_MISSING))


@dataclass(frozen=True)
class ReaderJudgement:
    """The fields a reader lacks and the results it missed on kept output."""

    missing: tuple[str, ...] = ()
    missed: tuple[str, ...] = ()
    output_id: int | None = None

    @property
    def is_valid(self) -> bool:
        return not self.missing and not self.missed

    @property
    def text(self) -> str:
        return ", ".join((*self.missing, *self.missed))

    @property
    def reason_code(self) -> ReasonCode:
        """Why the reader is poor: the first result it missed on its output, else the fields it lacks."""
        missed = " ".join(self.missed)
        return next((reason for miss, reason in MISSED_REASONS if miss in missed), ReasonCode.FIELDS_MISSING)
