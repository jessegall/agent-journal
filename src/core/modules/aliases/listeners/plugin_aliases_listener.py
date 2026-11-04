from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.repository.repository import Repository
from core.base.registry.registry import Registry
from core.modules.aliases.models.alias import Alias
from core.modules.aliases.support.alias_names import AliasNames
from core.modules.aliases.support.alias_readers import AliasReaders
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest


class PluginAliasesListener(SaveListener):
    """An installed plugin's aliases become the project's, in the install's transaction, each line run from
    the plugin's folder, named in full so it runs from any folder; a name the journal or the project holds
    already is skipped, and the aliases go with the plugin's row."""

    name = "aliases.plugin-aliases"
    event = "plugin.create"

    def __init__(self, repository: Repository, names: AliasNames, readers: AliasReaders, folders: PluginFolders, registry: Registry) -> None:
        self.repository, self.names, self.readers, self.folders = repository, names, readers, folders
        self.registry = registry

    def handle(self, change: Change[Model]) -> None:
        plugin = change.row
        if not isinstance(plugin, Plugin):
            return
        folder = self.folders.code(plugin.name)
        for shipped in PluginManifest.read(folder).aliases:
            if not self.names.is_free(shipped.name):
                continue
            self.repository.save(Alias(creator_id=change.actor.id, name=shipped.name, line=f"{folder}/{shipped.line}", description=shipped.description,
                                       variables=shipped.variables, reader_id=self.readers.existing_reader_id(shipped.reader_name), background=shipped.background,
                                       agent_access=shipped.has_agent_access(self.registry.alias_permission_names), plugin_id=plugin.id, category=shipped.category), change.context)
