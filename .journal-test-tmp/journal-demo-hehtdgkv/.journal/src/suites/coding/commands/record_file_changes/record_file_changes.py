from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RecordFileChanges(Command[None]):
    """Records the files a file scan found changed, for the agent whose shell line or edit tool it followed."""

    report_path: str
    process_id: int | None = None
    session: str = ""
