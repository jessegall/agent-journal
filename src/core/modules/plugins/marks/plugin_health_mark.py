from engine.chat.mark_declaration import MarkDeclaration
from core.modules.plugins.models.enums.plugin_mark_type import PluginMarkType
from core.modules.plugins.models.enums.plugin_mark_variant import PluginMarkVariant
from core.modules.plugins.support.plugin_marks import PLUGINS_FAMILY


class PluginHealthMark(MarkDeclaration):
    """The mark PluginMarkType.HEALTH."""

    type = PluginMarkType.HEALTH
    variants = PluginMarkVariant
    family = PLUGINS_FAMILY
    label = "Plugin health"
    mark_icon = "plugin"
