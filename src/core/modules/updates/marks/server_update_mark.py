from engine.chat.mark_declaration import MarkDeclaration
from core.modules.updates.models.enums.update_mark_type import UpdateMarkType
from core.modules.updates.models.enums.update_step import UpdateStep
from core.modules.updates.support.update_marks import UPDATES_FAMILY


class ServerUpdateMark(MarkDeclaration):
    """The mark UpdateMarkType.SERVER_UPDATE."""

    type = UpdateMarkType.SERVER_UPDATE
    variants = UpdateStep
    family = UPDATES_FAMILY
    label = "Server updates"
    mark_icon = "update"
    process = True
