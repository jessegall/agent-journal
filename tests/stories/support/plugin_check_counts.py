from collections.abc import Iterator
from contextlib import contextmanager
from unittest.mock import patch

from core.modules.plugins.support.plugin_run_check import PluginRunCheck
from core.modules.plugins.support.runnable_plugins import RunnablePlugins


class PluginCheckCounts:
    """How many times a story's hooks checked from the plugin's files whether it may run."""

    def __init__(self) -> None:
        self.count = 0

    @staticmethod
    @contextmanager
    def counted() -> Iterator["PluginCheckCounts"]:
        counts = PluginCheckCounts()
        checked = RunnablePlugins.check

        def counted_check(plugins: RunnablePlugins, *arguments: object) -> PluginRunCheck:
            counts.count += 1
            return checked(plugins, *arguments)

        with patch.object(RunnablePlugins, "check", counted_check):
            yield counts
