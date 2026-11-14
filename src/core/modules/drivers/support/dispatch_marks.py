from engine.enums.mark_click import MarkClick
from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.enums.mark_group import MarkGroup
from core.modules.drivers.models.enums.dispatch_mark_type import DispatchMarkType
from core.modules.drivers.models.enums.dispatch_mark_variant import DispatchMarkVariant

DISPATCHES_FAMILY = MarkFamily("drivers.dispatches", "Helper jobs", "subagent", MarkGroup.AGENT)

DISPATCH_MARKS = [MarkDeclaration(DispatchMarkType.DISPATCH, DispatchMarkVariant, DISPATCHES_FAMILY, "Helper updates", "subagent", click=MarkClick.OPEN_ROW, process=True, group_label="{count} helper updates")]
