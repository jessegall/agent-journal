from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.plugins.commands.switch_off_changed_plugin import SwitchOffChangedPlugin
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.plugin_skill_files import PluginSkillFiles


class SwitchOffChangedPluginHandler(Handler[SwitchOffChangedPlugin, Plugin]):
    """Saves the plugin switched off, its digest kept, so it stays off until the person switches it on."""

    command = SwitchOffChangedPlugin

    def __init__(self, queries: Queries, skill_files: PluginSkillFiles, repository: Repository) -> None:
        self.queries, self.skill_files, self.repository = queries, skill_files, repository

    def handle(self, command: SwitchOffChangedPlugin, context: Context) -> Plugin:
        plugin = self.queries.query(Plugin).find(command.plugin_id)
        self.skill_files.withdraw(plugin.name)
        return self.repository.save(plugin.changed(enabled=False), context)
