from engine.enums.mark_colouring import MarkColouring
from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.enums.mark_group import MarkGroup
from core.modules.updates.models.enums.update_mark_type import UpdateMarkType
from core.modules.updates.models.enums.update_step import UpdateStep

UPDATES_FAMILY = MarkFamily("updates.server-updates", "Server updates", "update", MarkGroup.JOURNAL, MarkColouring.OUTCOME)

UPDATE_MARKS = [MarkDeclaration(UpdateMarkType.SERVER_UPDATE, UpdateStep, UPDATES_FAMILY, "Server updates", "update", process=True)]
