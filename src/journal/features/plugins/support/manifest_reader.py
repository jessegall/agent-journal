import json
import re
from pathlib import Path

from journal.features.plugins.support.plugin_folders import PluginFolders
from journal.features.registry import Registry
from journal.support.plugin_manifest import PluginManifest
from journal.support.rejection import Rejection
from journal.repositories.plugins import Plugins

MANIFEST = "journal-plugin.json"
NAME = re.compile(r"^[a-z0-9][a-z0-9-]{1,31}$")
PROTOCOLS = (1,)
AGENT_EVENTS = ("tool_starting", "command_starting", "tool_finished", "file_edited", "idle", "prompt_submitted", "session_started", "session_ended", "compacting", "subagent_started", "subagent_ended", "ticked", "plugin.updated")
HOLDABLE = ("tool_starting", "command_starting", "file_edited", "idle", "prompt_submitted", "session_started")
ROW_EVENT = re.compile(r"^(?P<table>[a-z_]+)\.(created|updated|deleted)$")
PRIVATE_TABLES = ("secrets", "mcp_servers", "users")
KEYS = {f for f in PluginManifest.__dataclass_fields__}
PATHS = ("program", "settings", "skills")


class ManifestReader:
    """A plugin's manifest read from its folder and checked: every key known, its name free, its protocol spoken, what it holds heard and holdable, every path it names inside its folder, and its skills' names free; anything else is refused by name."""

    def __init__(self, registry: Registry, plugins: Plugins, folders: PluginFolders) -> None:
        self.registry, self.plugins, self.folders = registry, plugins, folders

    def read(self, folder: Path) -> PluginManifest:
        file = folder / MANIFEST
        if not file.is_file():
            raise Rejection(f"{folder} holds no {MANIFEST}")
        raw = json.loads(file.read_text())
        unknown = sorted(set(raw) - KEYS)
        if unknown:
            raise Rejection(f"{MANIFEST} has keys the journal does not know: {', '.join(unknown)}")
        manifest = PluginManifest.parsed(raw)
        self.name_check(manifest)
        self.protocol_check(manifest)
        self.event_check(manifest)
        self.folder_check(folder, manifest)
        self.skills_free(folder, manifest)
        return manifest

    @staticmethod
    def skill_names(folder: Path, manifest: PluginManifest) -> list[str]:
        skills = folder / manifest.skills
        return sorted(d.name for d in skills.iterdir() if (d / "SKILL.md").is_file()) if manifest.skills and skills.is_dir() else []

    def skills_free(self, folder: Path, manifest: PluginManifest) -> None:
        claimed = {skill.folder: "the journal" for skill in self.registry.skills()}
        for plugin in self.plugins.all():
            if plugin.name != manifest.name:
                claimed |= {name: f"plugin {plugin.name}" for name in self.skill_names(self.folders.folder(plugin), plugin.manifest)}
        for name in self.skill_names(folder, manifest):
            if name in claimed:
                raise Rejection(f"{manifest.name}'s skill {name} has the name of a skill of {claimed[name]}")

    def name_check(self, manifest: PluginManifest) -> None:
        if not NAME.match(manifest.name):
            raise Rejection(f"a plugin's name is 2 to 32 lowercase letters, digits and dashes: {manifest.name!r} is not")
        if self.registry.has_feature(manifest.name):
            raise Rejection(f"{manifest.name} is the name of one of the journal's own features")

    @staticmethod
    def protocol_check(manifest: PluginManifest) -> None:
        if manifest.protocol not in PROTOCOLS:
            raise Rejection(f"{manifest.name} speaks protocol {manifest.protocol}; this journal speaks {', '.join(map(str, PROTOCOLS))}")

    @staticmethod
    def event_check(manifest: PluginManifest) -> None:
        for event in manifest.events:
            row = ROW_EVENT.match(event)
            if event not in AGENT_EVENTS and not row:
                raise Rejection(f"{manifest.name} hears {event}, which is no event")
            if row and row["table"] in PRIVATE_TABLES:
                raise Rejection(f"{manifest.name} hears {event}: the {row['table']} rows are never sent to a plugin")
        for window in manifest.blocks:
            if window.event not in manifest.events:
                raise Rejection(f"{manifest.name} holds {window.event} but does not hear it")
            if window.event not in HOLDABLE:
                raise Rejection(f"{manifest.name} holds {window.event}, which no plugin may hold; it may hold {', '.join(HOLDABLE)}")
            if window.window_ms < 0:
                raise Rejection(f"{manifest.name} holds {window.event} within {window.window_ms} ms: a window is 0 or more milliseconds")

    @staticmethod
    def folder_check(folder: Path, manifest: PluginManifest) -> None:
        root = folder.resolve()
        matched = [(key, getattr(manifest, key)) for key in PATHS if getattr(manifest, key)]
        matched += [(f"service {s.name}", s.program) for s in manifest.services if s.is_local]
        matched += [(f"setup step {step.name}", word) for step in manifest.setup for word in step.run.split()[:2] if "/" in word]
        matched += [("installed command", word) for word in manifest.installed.split()[:1] if "/" in word]
        for key, path in matched:
            if Path(path).is_absolute() or not (root / path).resolve().is_relative_to(root):
                raise Rejection(f"{manifest.name}'s {key} {path} leads outside its folder")
        if not (root / manifest.program).is_file():
            raise Rejection(f"{manifest.name}'s program {manifest.program} is not in its folder")
