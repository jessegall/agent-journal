from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.plugins.commands.change_plugin_service.change_plugin_service import ChangePluginService
from core.modules.plugins.models.enums.service_change import ServiceChange


class ChangePluginServiceSubcommand(Subcommand[ChangePluginService, str]):
    """`journal plugin service stop|start|restart <plugin> <service>`: changes one service of a plugin."""

    cli_name = "plugin"
    name = "service"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("change", choices=[change.value for change in ServiceChange])
        parser.add_argument("plugin")
        parser.add_argument("service")

    def command(self, arguments: Namespace, caller: Caller) -> ChangePluginService:
        return ChangePluginService(ServiceChange(arguments.change), arguments.plugin, arguments.service)
