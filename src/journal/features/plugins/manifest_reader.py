import json
import re
from pathlib import Path

from journal.features.registry import Registry
from journal.models.plugin_manifest import PluginManifest
from journal.refused import Refused

MANIFEST = "journal-plugin.json"
"""The file in a plugin's folder that says what it is."""
NAME = re.compile(r"^[a-z0-9][a-z0-9-]{1,31}$")
PROTOCOLS = (1,)
"""The protocol versions this journal speaks; a later one adds fields and never changes one."""
AGENT_EVENTS = ("tool_starting", "tool_finished", "idle", "prompt_submitted", "session_started", "session_ended", "compacting", "subagent_started", "subagent_ended", "ticked", "plugin.updated")
HOLDABLE = ("tool_starting", "idle", "prompt_submitted", "session_started")
"""The events a plugin may answer before the agent goes on; at a prompt and a start it may only tell, never refuse."""
ROW_EVENT = re.compile(r"^(?P<table>[a-z_]+)\.(created|updated|deleted)$")
NEVER_TABLES = ("secrets", "mcp_servers")
"""Rows no plugin is sent, whatever it asks."""
KEYS = {f for f in PluginManifest.__dataclass_fields__}
PATHS = ("program", "settings", "skills")


class ManifestReader:
    """A plugin's manifest read from its folder and checked: every key known, its name free, its protocol spoken, what it holds heard and holdable, and every path it names inside its folder; anything else is refused by name."""

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def read(self, folder: Path) -> PluginManifest:
        file = folder / MANIFEST
        if not file.is_file():
            raise Refused(f"{folder} holds no {MANIFEST}")
        raw = json.loads(file.read_text())
        unknown = sorted(set(raw) - KEYS)
        if unknown:
            raise Refused(f"{MANIFEST} has keys the journal does not know: {', '.join(unknown)}")
        manifest = PluginManifest(**{**raw, **{key: tuple(raw[key]) for key in ("hears", "holds", "services", "cards", "requires", "setup") if key in raw}})
        self.named(manifest)
        self.spoken(manifest)
        self.heard(manifest)
        self.inside(folder, manifest)
        return manifest

    def named(self, manifest: PluginManifest) -> None:
        if not NAME.match(manifest.name):
            raise Refused(f"a plugin's name is 2 to 32 lowercase letters, digits and dashes: {manifest.name!r} is not")
        if self.registry.has_feature(manifest.name):
            raise Refused(f"{manifest.name} is the name of one of the journal's own features")

    @staticmethod
    def spoken(manifest: PluginManifest) -> None:
        if manifest.protocol not in PROTOCOLS:
            raise Refused(f"{manifest.name} speaks protocol {manifest.protocol}; this journal speaks {', '.join(map(str, PROTOCOLS))}")

    @staticmethod
    def heard(manifest: PluginManifest) -> None:
        for event in manifest.hears:
            row = ROW_EVENT.match(event)
            if event not in AGENT_EVENTS and not row:
                raise Refused(f"{manifest.name} hears {event}, which is no event")
            if row and row["table"] in NEVER_TABLES:
                raise Refused(f"{manifest.name} hears {event}: the {row['table']} rows are never sent to a plugin")
        for event in manifest.holds:
            if event not in manifest.hears:
                raise Refused(f"{manifest.name} holds {event} but does not hear it")
            if event not in HOLDABLE:
                raise Refused(f"{manifest.name} holds {event}, which no plugin may hold; it may hold {', '.join(HOLDABLE)}")

    @staticmethod
    def inside(folder: Path, manifest: PluginManifest) -> None:
        root = folder.resolve()
        named = [(key, getattr(manifest, key)) for key in PATHS if getattr(manifest, key)]
        named += [(f"service {s.get('name', '')}", s["command"][0]) for s in manifest.services if s.get("command") and "/" in s["command"][0]]
        for key, path in named:
            if Path(path).is_absolute() or not (root / path).resolve().is_relative_to(root):
                raise Refused(f"{manifest.name}'s {key} {path} leads outside its folder")
        if not (root / manifest.program).is_file():
            raise Refused(f"{manifest.name}'s program {manifest.program} is not in its folder")
