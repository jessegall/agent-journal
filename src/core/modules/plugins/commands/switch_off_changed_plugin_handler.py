from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.plugins.commands.switch_off_changed_plugin import SwitchOffChangedPlugin
from core.modules.plugins.models.plugin import Plugin


class SwitchOffChangedPluginHandler(Handler[SwitchOffChangedPlugin, Plugin]):
    """Saves the plugin switched off, its digest kept, so it stays off until the person switches it on."""

    command = SwitchOffChangedPlugin

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: SwitchOffChangedPlugin, context: Context) -> Plugin:
        return self.repository.save(self.queries.query(Plugin).find(command.plugin_id).changed(enabled=False), context)
