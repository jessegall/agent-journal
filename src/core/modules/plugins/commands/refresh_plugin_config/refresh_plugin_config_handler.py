import json
import os
from pathlib import Path

from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.file_access import FileAccess
from core.base.journal_home import JournalHome
from core.base.json_pointer import JsonPointer
from core.base.json_schema import JsonSchema
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.skill.skill_digest import SkillDigest
from core.base.type_guards import is_mapping
from core.modules.plugins.commands.record_plugin_fault.record_plugin_fault import RecordPluginFault
from core.modules.plugins.commands.refresh_plugin_config.refresh_plugin_config import RefreshPluginConfig
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.manifest_config import ManifestConfig
from core.modules.plugins.support.runnable_plugins import RunnablePlugins


class RefreshPluginConfigHandler(Handler[RefreshPluginConfig, Plugin]):
    """Keeps a plugin's config as the project holds it, never a worktree's copy: a document handed in is
    checked against the plugin's schema and written whole, and a changed file becomes the next version with
    the places that changed, or, when it no longer fits the schema, leaves the last good copy served and
    records the fault."""

    command = RefreshPluginConfig

    def __init__(self, queries: Queries, repository: Repository, home: JournalHome, plugins: RunnablePlugins, bus: Bus) -> None:
        self.queries, self.repository, self.home, self.plugins, self.bus = queries, repository, home, plugins, bus

    def handle(self, command: RefreshPluginConfig, context: Context) -> Plugin:
        plugin = self.queries.query(Plugin).find(command.plugin_id)
        config = self.config(plugin)
        file = self.home.project_folder / config.file
        schema = self.schema(config)
        given_text = self.given_text(command, file)
        if given_text is not None:
            problems = self.problems(schema, given_text)
            if problems:
                raise Refusal(f"the {plugin.name} config does not fit its schema: {'; '.join(problems)}", "change the values at those places")
            self.write(file, given_text)
        if given_text is None and not file.is_file():
            return plugin
        text = given_text if given_text is not None else self.read(file)
        digest = SkillDigest.digest(text)
        if digest == plugin.config_digest:
            return plugin
        problems = [] if given_text is not None else self.problems(schema, text)
        if problems:
            fault = f"its config {config.file} does not fit its schema, so the last good copy stays: {'; '.join(problems)}"
            faulted = self.bus.dispatch(RecordPluginFault(plugin.id, fault, False), context)
            return self.repository.save(faulted.changed(config_digest=digest), context)
        document = json.loads(text)
        pointers = JsonPointer.differences(json.loads(plugin.config_document), document)
        return self.repository.save(plugin.changed(config_version=plugin.config_version + 1, config_digest=digest, config_document=json.dumps(document),
                                                   config_pointers=json.dumps(pointers)), context)

    @staticmethod
    def read(file: Path) -> str:
        return FileAccess.shared().read(file) if file.is_file() else "null"

    @staticmethod
    def given_text(command: RefreshPluginConfig, file: Path) -> str | None:
        if not command.changes:
            return command.document_text
        document: object = json.loads(FileAccess.shared().read(file)) if file.is_file() else {}
        for pointer, value in command.changes:
            document = JsonPointer.with_value(document, pointer, value)
        return json.dumps(document, indent=2) + "\n"

    def config(self, plugin: Plugin) -> ManifestConfig:
        manifest = self.plugins.readable_manifest(plugin)
        if manifest is None or manifest.config is None:
            raise Refusal(f"the plugin {plugin.name} declares no config", "a plugin declares its config file and schema under config in its manifest")
        return manifest.config

    def schema(self, config: ManifestConfig) -> JsonSchema:
        schema = json.loads(FileAccess.shared().read(self.home.project_folder / config.schema))
        if not is_mapping(schema):
            raise Refusal(f"the schema {config.schema} is not a JSON object", "fix the plugin's schema file")
        return JsonSchema(schema)

    @staticmethod
    def problems(schema: JsonSchema, text: str) -> list[str]:
        try:
            document: object = json.loads(text)
        except ValueError as error:
            return [f"/: is not JSON ({error})"]
        return schema.problems(document)

    @staticmethod
    def write(file: Path, text: str) -> None:
        staging_file = file.with_name(f".{file.name}.writing")
        FileAccess.shared().write(staging_file, text)
        os.replace(staging_file, file)
