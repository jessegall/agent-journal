from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.documents.support.work_context_request import WorkContextRequest
from core.modules.documents.support.work_context_page import WorkContextPage
from core.modules.documents.support.work_context_text import WorkContextText
from core.modules.documents.support.work_context_attachment_page import WorkContextAttachmentPage
from core.modules.documents.support.work_context_file import WorkContextFile


@dataclass(frozen=True)
class ReadPlanContext(Command[WorkContextPage | WorkContextText | WorkContextAttachmentPage | WorkContextFile]):
    """Reads one authorized plan context page and records the agent's successful read."""

    plan_id: int
    request: WorkContextRequest
