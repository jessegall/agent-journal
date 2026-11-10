from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.log.system_log_writer import SystemLogWriter
from core.modules.plugins.commands.log_plugin_line.log_plugin_line import LogPluginLine


class LogPluginLineHandler(Handler[LogPluginLine, None]):
    """Writes the line under the plugin's name, so the system log shows which plugin wrote it."""

    command = LogPluginLine

    def __init__(self, system_log: SystemLogWriter) -> None:
        self.system_log = system_log

    def handle(self, command: LogPluginLine, context: Context) -> None:
        self.system_log.write(command.level, f"plugin {command.plugin_name}: {command.text}")
