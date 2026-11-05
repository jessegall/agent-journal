from core.base.chat.mark_colouring import MarkColouring
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.modules.updates.models.enums.update_mark_type import UpdateMarkType
from core.modules.updates.models.enums.update_step import UpdateStep

UPDATES_FAMILY = MarkFamily("updates.server-updates", "Server updates", "update", MarkGroup.JOURNAL, MarkColouring.OUTCOME)

UPDATE_MARKS = [MarkDeclaration(UpdateMarkType.SERVER_UPDATE, UpdateStep, UPDATES_FAMILY, "Server updates", "update", process=True)]
