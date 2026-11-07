from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.view_model import ViewModel
from core.base.timestamp import Timestamp
from core.modules.messages.models.support.views import ATTACHED_FILES_SELECT


@dataclass(frozen=True, kw_only=True)
class AttachedFile(EnvironmentScoped, ViewModel):
    """One file sent with a message, as the Attachments window lists it, read from the attached_files view."""

    cli_name = "attachment"
    view = "attached_files"
    key = "row_key"
    select = ATTACHED_FILES_SELECT

    row_key: str
    message_id: int
    environment_id: int
    name: str
    message_text: str
    created_at: Timestamp
