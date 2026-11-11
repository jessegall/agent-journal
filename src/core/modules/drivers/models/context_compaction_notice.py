from dataclasses import dataclass

from engine.model.model import Model
from core.modules.drivers.models.enums.compaction_notice_type import CompactionNoticeType


@dataclass(frozen=True, kw_only=True)
class ContextCompactionNotice(Model):
    """One thing a person was told about one compaction that went wrong, told once and shown in the chat."""

    model_name = "context_compaction_notice"
    cli_name = "context-compaction-notice"
    shared_rows = True

    compaction_id: int
    session_agent_id: int
    agent_number: int
    notice: CompactionNoticeType
    cause: str

    @property
    def text(self) -> str:
        return f"Agent {self.agent_number}: {self.notice.text}{': ' + self.cause if self.cause else ''}"
