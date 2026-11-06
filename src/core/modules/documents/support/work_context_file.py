from dataclasses import dataclass

from core.modules.documents.support.work_context_file_content import WorkContextFileContent


@dataclass(frozen=True)
class WorkContextFile:
    """One attachment opened only after its message passes context authorization."""

    model: str
    id: int
    message_id: int
    attachment: WorkContextFileContent

    def lines(self) -> tuple[str, ...]:
        return (f"message:{self.message_id} attachment", self.attachment.content_base64)
