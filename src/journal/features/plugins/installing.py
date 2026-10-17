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

    def free(self, name: str) -> None:
        try:
            self.plugins.named(name)
        except NotFound:
            return
        raise Refused(f"a plugin named {name} is installed already: journal plugin upgrade {name}")

    @contextmanager
    def staged(self, source: str) -> Iterator[tuple[Path, str]]:
        """A folder is read where it lies; a git address is fetched into a folder of its own, gone once read."""
        if Path(source).is_dir():
            yield Path(source).resolve(), ""
            return
        home = self.config.home / "plugins"
        home.mkdir(parents=True, exist_ok=True)
        temporary = Path(tempfile.mkdtemp(prefix=".fetching-", dir=home))
        try:
            fetched = subprocess.run(["git", "clone", "--depth", "1", source, str(temporary / "plugin")], capture_output=True, text=True, timeout=FETCH_SECONDS)
            if fetched.returncode != 0:
                raise Refused(f"could not fetch {source}: {fetched.stderr.strip()[-300:]}")
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

