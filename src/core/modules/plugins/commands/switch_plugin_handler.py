from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.plugins.commands.support.user_actor_check import UserActorCheck
from core.modules.plugins.commands.switch_plugin import SwitchPlugin
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.queries.plugin_query import PluginQuery


class SwitchPluginHandler(Handler[SwitchPlugin, Plugin]):
    """Switches an installed plugin on or off; only the person does."""

    command = SwitchPlugin

    def __init__(self, plugins: PluginQuery, repository: Repository) -> None:
        self.plugins, self.repository = plugins, repository

    def handle(self, command: SwitchPlugin, context: Context) -> Plugin:
        UserActorCheck.check(context, "switches on" if command.enabled else "switches off")
        return self.repository.save(self.plugins.find_name(command.name).changed(enabled=command.enabled), context)
