import shutil
import subprocess
import tempfile
from contextlib import contextmanager
from dataclasses import asdict
from pathlib import Path
from typing import Iterator

from journal.config import Config
from journal.features.plugins.manifest_reader import ManifestReader
from journal.features.plugins.plugin_folders import PluginFolders
from journal.models.actor import Actor
from journal.models.plugin import Plugin
from journal.models.plugin_manifest import PluginManifest
from journal.refused import Refused
from journal.repositories.not_found import NotFound
from journal.repositories.plugins import Plugins

FETCH_SECONDS = 120
COMPARED = ("version", "program", "hears", "holds", "services", "settings", "skills")
"""What an upgrade shows changing: what the plugin runs, hears and holds."""


class Installing:
    """A plugin taken in: a folder linked where it lies, or a git address fetched into the journal's plugins folder; its manifest read and checked, a preview of all it will run, and only then its row and data folder."""

    def __init__(self, config: Config, reader: ManifestReader, plugins: Plugins, folders: PluginFolders) -> None:
        self.config, self.reader, self.plugins, self.folders = config, reader, plugins, folders

    def preview(self, source: str) -> str:
        with self.staged(source) as (folder, commit):
            return self.described(self.reader.read(folder), folder, source, commit)

    def install(self, source: str, by: Actor) -> Plugin:
        with self.staged(source) as (folder, commit):
            manifest = self.reader.read(folder)
            self.free(manifest.name)
            linked = Path(source).is_dir()
            if not linked:
                shutil.copytree(folder, self.config.home / "plugins" / manifest.name, ignore=shutil.ignore_patterns(".git"))
            plugin = self.plugins.save(Plugin(name=manifest.name, source=str(folder) if linked else source, commit_sha=commit, linked=linked, manifest=asdict(manifest)), by)
            self.folders.data(plugin)
            return plugin

    def upgrade_preview(self, name: str, ref: str) -> str:
        plugin = self.plugins.named(name)
        with self.staged(plugin.source, ref) as (folder, commit):
            changes = self.changes(plugin.manifest, asdict(self.reader.read(folder)))
            return "\n".join([f"{name} from {plugin.commit_sha[:12] or plugin.source} to {commit[:12] or 'the folder as it is now'}", *(changes or ["nothing it runs, hears or holds changes"])])

    def upgrade(self, name: str, ref: str, by: Actor) -> Plugin:
        plugin = self.plugins.named(name)
        with self.staged(plugin.source, ref) as (folder, commit):
            manifest = self.reader.read(folder)
            if not plugin.linked:
                shutil.rmtree(self.folders.of(plugin))
                shutil.copytree(folder, self.folders.of(plugin), ignore=shutil.ignore_patterns(".git"))
            return self.plugins.save(plugin.with_(manifest=asdict(manifest), commit_sha=commit), by)

    @staticmethod
    def changes(was: dict, now: dict) -> list[str]:
        lines = []
        for key in COMPARED:
            before, after = was.get(key), now.get(key)
            if isinstance(after, (list, tuple)):
                before, after = list(before or ()), list(after)
                lines += [f"{key}: + {item}" for item in after if item not in before] + [f"{key}: - {item}" for item in before if item not in after]
            elif before != after:
                lines.append(f"{key}: {before} -> {after}")
        return lines

    def enable(self, name: str, by: Actor) -> Plugin:
        return self.plugins.save(self.plugins.named(name).with_(enabled=True), by)

    def disable(self, name: str, by: Actor) -> Plugin:
        return self.plugins.save(self.plugins.named(name).with_(enabled=False), by)

    def remove(self, name: str, by: Actor) -> None:
        """Its row and its fetched copy go; its data folder stays."""
        plugin = self.plugins.named(name)
        if not plugin.linked:
            shutil.rmtree(self.folders.of(plugin), ignore_errors=True)
        self.plugins.delete(plugin, by)

    def purge(self, name: str, by: Actor) -> None:
        """Removed, and its data folder with it."""
        data = self.folders.data(self.plugins.named(name))
        self.remove(name, by)
        shutil.rmtree(data, ignore_errors=True)

    def free(self, name: str) -> None:
        try:
            self.plugins.named(name)
        except NotFound:
            return
        raise Refused(f"a plugin named {name} is installed already: journal plugin upgrade {name}")

    @contextmanager
    def staged(self, source: str, ref: str = "") -> Iterator[tuple[Path, str]]:
        """A folder is read where it lies; a git address is fetched into a folder of its own at the commit asked for, or its newest, gone once read."""
        if Path(source).is_dir():
            yield Path(source).resolve(), ""
            return
        home = self.config.home / "plugins"
        home.mkdir(parents=True, exist_ok=True)
        temporary = Path(tempfile.mkdtemp(prefix=".fetching-", dir=home))
        try:
            fetched = subprocess.run(["git", "clone", "--quiet", source, str(temporary / "plugin")], capture_output=True, text=True, timeout=FETCH_SECONDS)
            if fetched.returncode == 0 and ref:
                fetched = subprocess.run(["git", "-C", str(temporary / "plugin"), "checkout", "--quiet", ref], capture_output=True, text=True, timeout=FETCH_SECONDS)
            if fetched.returncode != 0:
                raise Refused(f"could not fetch {source}{' at ' + ref if ref else ''}: {fetched.stderr.strip()[-300:]}")
            commit = subprocess.run(["git", "-C", str(temporary / "plugin"), "rev-parse", "HEAD"], capture_output=True, text=True, timeout=FETCH_SECONDS).stdout.strip()
            yield temporary / "plugin", commit
        finally:
            shutil.rmtree(temporary, ignore_errors=True)

    @staticmethod
    def described(manifest: PluginManifest, folder: Path, source: str, commit: str) -> str:
        lines = [f"{manifest.name} {manifest.version}" + (f": {manifest.title}" if manifest.title else ""), f"from {source}" + (f" at {commit[:12]}" if commit else " (linked: read where it lies)")]
        lines.append(f"runs {folder / manifest.program} for each event it hears")
        lines += [f"runs the service {s.get('name', '')}: {' '.join(s.get('command', ()))}" for s in manifest.services]
        lines.append(f"hears {', '.join(manifest.hears) or 'nothing'}")
        lines.append(f"holds {', '.join(manifest.holds) or 'nothing'}")
        if manifest.settings:
            lines.append(f"settings from {manifest.settings}")
        skills = ManifestReader.skill_names(folder, manifest)
        if skills:
            lines.append(f"skills {', '.join(skills)}")
        return "\n".join(lines)

