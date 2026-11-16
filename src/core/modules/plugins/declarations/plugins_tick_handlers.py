from core.modules.plugins.tick_handlers.delivery_pruning_tick_handler import DeliveryPruningTickHandler
from core.modules.plugins.tick_handlers.orphan_service_stopping_tick_handler import OrphanServiceStoppingTickHandler
from core.modules.plugins.tick_handlers.plugin_card_reading_tick_handler import PluginCardReadingTickHandler
from core.modules.plugins.tick_handlers.plugin_config_reading_tick_handler import PluginConfigReadingTickHandler

PLUGINS_TICK_HANDLERS = [PluginCardReadingTickHandler,
                     PluginConfigReadingTickHandler,
                     OrphanServiceStoppingTickHandler,
                     DeliveryPruningTickHandler]
