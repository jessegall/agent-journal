from core.base.command.context import Context
from engine.enums.actor_type import ActorType
from core.base.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.errors.refusal import Refusal
from core.modules.environments.models.environment import Environment
from core.modules.plugins.commands.configure_plugin.configure_plugin import ConfigurePlugin
from core.modules.plugins.models.plugin_setting import PluginSetting
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest


class ConfigurePluginHandler(Handler[ConfigurePlugin, PluginSetting]):
    """Keeps a setting the plugin's manifest declares, as a value of its type."""

    command = ConfigurePlugin

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, queries: Queries, repository: Repository) -> None:
        self.plugins, self.folders, self.queries, self.repository = plugins, folders, queries, repository

    def handle(self, command: ConfigurePlugin, context: Context) -> PluginSetting:
        plugin = self.plugins.find_name(command.name)
        if context.actor.type is ActorType.AGENT:
            grants = tuple(self.queries.query(Environment).filter(test=True, test_agent_id=context.actor.id).all_rows())
            if grants and command.environment_id not in {environment.id for environment in grants}:
                raise Refusal("this agent can configure the plugin only in its granted test environment")
        value = PluginManifest.read(self.folders.code(plugin.name)).setting(command.key).value_text(command.value)
        existing = self.queries.query(PluginSetting).filter(plugin_id=plugin.id, key=command.key, environment_id=command.environment_id).first()
        setting = existing.changed(value=value) if existing is not None else PluginSetting(plugin_id=plugin.id, creator_id=context.actor.id, key=command.key, value=value, environment_id=command.environment_id)
        return self.repository.save(setting, context)
