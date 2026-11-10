from engine.viewer.model_searcher import ModelSearcher
from core.modules.plugins.models.plugin import Plugin


class PluginSearcher(ModelSearcher):
    """Finds the plugins whose name or title holds the words."""

    model = Plugin
