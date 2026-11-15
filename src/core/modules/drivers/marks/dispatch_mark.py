from engine.chat.mark_declaration import MarkDeclaration
from core.modules.drivers.models.enums.dispatch_mark_type import DispatchMarkType
from core.modules.drivers.models.enums.dispatch_mark_variant import DispatchMarkVariant
from engine.enums.mark_click import MarkClick
from core.modules.drivers.support.dispatch_marks import DISPATCHES_FAMILY


class DispatchMark(MarkDeclaration):
    """The mark DispatchMarkType.DISPATCH."""

    type = DispatchMarkType.DISPATCH
    variants = DispatchMarkVariant
    family = DISPATCHES_FAMILY
    label = "Helper updates"
    mark_icon = "subagent"
    click = MarkClick.OPEN_ROW
    process = True
    group_label = "{count} helper updates"
