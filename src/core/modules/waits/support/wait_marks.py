from engine.enums.mark_click import MarkClick
from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.enums.mark_group import MarkGroup
from core.modules.waits.models.enums.wait_mark_type import WaitMarkType
from core.modules.waits.models.enums.wait_mark_variant import WaitMarkVariant

REPORTED_WAIT_FAMILY = MarkFamily("waits.impasse", "Agent stuck", "warning", MarkGroup.AGENT)

WAIT_MARKS = [MarkDeclaration(WaitMarkType.REPORTED_WAIT, WaitMarkVariant, REPORTED_WAIT_FAMILY, "Agent stuck", "stuck", click=MarkClick.OPEN_ROW)]
