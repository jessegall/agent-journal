from dataclasses import replace
from pathlib import Path

from engine.event.created import Created
from engine.event.updated import Updated
from engine.command.context import Context
from engine.listener.save_listener import SaveListener
from engine.repository.repository import Repository
from engine.registry.registry import Registry
from core.modules.aliases.models.alias import Alias
from core.modules.aliases.queries.alias_query import AliasQuery
from core.modules.aliases.support.alias_names import AliasNames
from core.modules.aliases.support.alias_readers import AliasReaders
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.manifest_alias import ManifestAlias
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest


class PluginAliasesListener(SaveListener[Created[Plugin] | Updated[Plugin]]):
    """An installed plugin's aliases become the project's, in the install's transaction, each line run from
    the plugin's folder, named in full so it runs from any folder; a name the journal or the project holds
    already is skipped, and the aliases go with the plugin's row. An upgrade that changes the plugin's files
    brings the aliases in line with its manifest: new ones are added, declared ones updated and ones it no
    longer declares removed."""

    name = "aliases.plugin-aliases"

    def __init__(self, repository: Repository, aliases: AliasQuery, names: AliasNames, readers: AliasReaders, folders: PluginFolders, registry: Registry) -> None:
        self.repository, self.aliases, self.names, self.readers, self.folders = repository, aliases, names, readers, folders
        self.registry = registry

    def handle(self, event: Created[Plugin] | Updated[Plugin], context: Context) -> None:
        plugin = event.row
        if event.old_row is not None and event.old_row.files_digest == plugin.files_digest:
            return
        folder = self.folders.code(plugin.name)
        manifest_aliases = {alias.name: alias for alias in PluginManifest.read(folder).aliases}
        stored_aliases = {alias.name: alias for alias in self.aliases.filter(plugin_id=plugin.id).all_rows()}
        for stored in stored_aliases.values():
            if stored.name not in manifest_aliases:
                self.repository.delete(stored, context)
        reader_ids = {reader_name: self.readers.existing_reader_id(reader_name) for reader_name in {alias.reader_name for alias in manifest_aliases.values()}}
        for name, manifest_alias in manifest_aliases.items():
            alias = self.alias(manifest_alias, plugin, folder, context.actor.id, reader_ids[manifest_alias.reader_name])
            if name in stored_aliases:
                stored = stored_aliases[name]
                self.repository.save(replace(alias, id=stored.id, version=stored.version, creator_id=stored.creator_id, agent_access=stored.agent_access or alias.agent_access), context)
            elif self.names.is_free(name):
                self.repository.save(alias, context)

    def alias(self, manifest_alias: ManifestAlias, plugin: Plugin, folder: Path, creator_id: int, reader_id: int | None) -> Alias:
        return Alias(creator_id=creator_id, name=manifest_alias.name, line=f"{folder}/{manifest_alias.line}", description=manifest_alias.description,
                     variables=manifest_alias.variables, reader_id=reader_id, background=manifest_alias.background,
                     agent_access=manifest_alias.has_agent_access(self.registry.alias_permission_names), plugin_id=plugin.id, category=manifest_alias.category)
