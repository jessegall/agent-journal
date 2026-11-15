from engine.chat.mark_declaration import MarkDeclaration
from engine.enums.mark_click import MarkClick
from core.modules.waits.models.enums.wait_mark_type import WaitMarkType
from core.modules.waits.models.enums.wait_mark_variant import WaitMarkVariant
from core.modules.waits.support.wait_marks import REPORTED_WAIT_FAMILY


class ReportedWaitMark(MarkDeclaration):
    """The mark WaitMarkType.REPORTED_WAIT."""

    type = WaitMarkType.REPORTED_WAIT
    variants = WaitMarkVariant
    family = REPORTED_WAIT_FAMILY
    label = "Agent stuck"
    mark_icon = "stuck"
    click = MarkClick.OPEN_ROW
