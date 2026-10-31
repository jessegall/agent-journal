from core.base.chat.mark_click import MarkClick
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.modules.waits.models.enums.wait_mark_type import WaitMarkType
from core.modules.waits.models.enums.wait_mark_variant import WaitMarkVariant

IMPASSE_FAMILY = MarkFamily("waits.impasse", "Agent stuck", "fault", MarkGroup.AGENT)

WAIT_MARKS = [MarkDeclaration(WaitMarkType.IMPASSE, WaitMarkVariant, IMPASSE_FAMILY, "Agent stuck", "stuck", click=MarkClick.OPEN_ROW)]
