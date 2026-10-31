from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class JournalFault(Model):
    """One fault the journal met in its own work: where it happened, what went wrong, and the environment it
    happened for, if one is known. The error log file keeps the trace."""

    model_name = "journal_fault"
    cli_name = "journal-fault"

    environment_id: int | None = None
    creator_id: int
    source: str
    message: str
