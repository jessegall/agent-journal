from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.chat.mark_group import MarkGroup
from core.modules.plugins.models.enums.plugin_card_tone import PluginCardTone
from core.modules.plugins.models.enums.plugin_mark_type import PluginMarkType
from core.modules.plugins.models.enums.plugin_mark_variant import PluginMarkVariant

PLUGINS_FAMILY = MarkFamily("plugins.plugins", "Plugins", "plugin", MarkGroup.JOURNAL)

PLUGIN_MARKS = [MarkDeclaration(PluginMarkType.HEALTH, PluginMarkVariant, PLUGINS_FAMILY, "Plugin health", "plugin"),
                MarkDeclaration(PluginMarkType.CARD, PluginCardTone, PLUGINS_FAMILY, "Plugin card", "plugin")]
