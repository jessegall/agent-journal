from journal.features.plugins.support.plugin_fault import PluginFault


class WindowMissed(PluginFault):
    """A plugin that gave no answer inside its hold window: its answer is dropped and the event goes through, it is asked again at the next event, and the miss is recorded without counting as a fault."""
