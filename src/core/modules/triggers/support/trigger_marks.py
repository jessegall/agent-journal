from core.base.chat.mark_button import MarkButton
from core.base.chat.mark_click import MarkClick
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.modules.triggers.models.enums.trigger_mark_type import TriggerMarkType
from core.modules.triggers.models.enums.trigger_mark_variant import TriggerMarkVariant

TRIGGERS_FAMILY = MarkFamily("triggers.triggers", "Triggers", "bulb", MarkGroup.JOURNAL)
WAITING_VARIANTS = tuple([TriggerMarkVariant.WAITING.value])
ENABLE = MarkButton("tick", "Enable the trigger", "trigger enable {row_id}", variants=WAITING_VARIANTS)
TRIGGER_MARKS = [MarkDeclaration(TriggerMarkType.WAITING, TriggerMarkVariant, TRIGGERS_FAMILY, "Trigger", "bulb", click=MarkClick.OPEN_ROW, process=True)]
