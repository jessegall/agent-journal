from engine.chat.mark_button import MarkButton
from engine.chat.mark_category import MarkCategory
from engine.enums.mark_group import MarkGroup
from core.modules.triggers.models.enums.trigger_mark_variant import TriggerMarkVariant

TRIGGERS_FAMILY = MarkCategory("triggers.triggers", "Triggers", "bulb", MarkGroup.JOURNAL)
WAITING_VARIANTS = tuple([TriggerMarkVariant.WAITING.value])
ENABLE = MarkButton("tick", "Enable", "trigger enable {row_id}", variants=WAITING_VARIANTS)
