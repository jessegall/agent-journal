from engine.chat.mark_declaration import MarkDeclaration
from core.modules.plugins.models.enums.plugin_card_tone import PluginCardTone
from core.modules.plugins.models.enums.plugin_mark_type import PluginMarkType
from core.modules.plugins.support.plugin_marks import PLUGINS_FAMILY


class PluginCardMark(MarkDeclaration):
    """The mark PluginMarkType.CARD."""

    type = PluginMarkType.CARD
    variants = PluginCardTone
    family = PLUGINS_FAMILY
    label = "Plugin card"
    mark_icon = "plugin"
