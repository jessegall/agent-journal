from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class JournalException(Model):
    """One exception the journal met in its own work: where it happened, what went wrong, and the environment it
    happened for, if one is known. The error log file keeps the trace."""

    shared_rows = True

    model_name = "journal_exception"
    cli_name = "journal-exception"

    environment_id: int | None = None
    creator_id: int
    source: str
    message: str
