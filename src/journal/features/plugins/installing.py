import json
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
from journal.features.plugins.plugin_changes import PluginChanges
from journal.features.plugins.plugin_hashes import PluginHashes
from journal.features.plugins.plugin_runner import PluginRunner
from journal.features.plugins.plugin_settings import PluginSettings
from journal.features.plugins.plugin_skills import PluginSkills
from journal.models.actor import Actor
from journal.models.actor_kind import ActorKind
from journal.models.plugin import Plugin
from journal.models.plugin_manifest import PluginManifest
from journal.refused import Refused
from journal.repositories.not_found import NotFound
from journal.repositories.plugins import Plugins

FETCH_SECONDS = 120
STEP_SECONDS = 300
"""The longest a requirement's check, a setup step or the installed command may run."""


class Installing:
    """A plugin taken in: a folder linked where it lies, or a git address fetched into the journal's plugins folder; its manifest read and checked, a preview of all it will run, and only then its row and data folder."""

    def __init__(self, config: Config, reader: ManifestReader, plugins: Plugins, folders: PluginFolders, hashes: PluginHashes, settings: PluginSettings, skills: PluginSkills, runner: PluginRunner) -> None:
        self.config, self.reader, self.plugins, self.folders, self.hashes, self.settings, self.skills, self.runner = config, reader, plugins, folders, hashes, settings, skills, runner

    def preview(self, source: str) -> tuple[PluginManifest, str]:
        """The manifest as read, and all it would run, said."""
        with self.staged(source) as (folder, commit):
            manifest = self.reader.read(folder)
            return manifest, self.described(manifest, folder, source, commit)

    def install(self, source: str, environment: str, by: Actor) -> Plugin:
        """Its requirements checked, its setup steps run in order and its installed command asked, all before its row is made; a failure leaves nothing."""
        self.only_the_user(by, "installs")
        with self.staged(source) as (folder, commit):
            manifest = self.reader.read(folder)
            self.free(manifest.name)
            linked = Path(source).is_dir()
            plugin = Plugin(name=manifest.name, source=str(folder) if linked else source, commit_sha=commit, linked=linked, manifest=asdict(manifest), hashes=self.hashes.of(folder, asdict(manifest)))
            had_data = (self.config.home / "plugin-data" / plugin.name).is_dir()
            if not linked:
                shutil.copytree(folder, self.folders.of(plugin), ignore=shutil.ignore_patterns(".git"))
            try:
                self.required(plugin, environment)
                self.set_up(plugin, environment)
                filled = self.asked(plugin, environment)
            except Refused:
                self.undone(plugin, had_data)
                raise
            settings = self.settings.started(plugin, by)
            saved = self.plugins.save(plugin.with_(settings={**settings, **{k: v for k, v in filled.items() if k in settings and not isinstance(settings[k], dict)}}), by)
            self.folders.data(saved)
            self.skills.publish(saved)
            return saved

    def required(self, plugin: Plugin, environment: str) -> None:
        for program, need in plugin.manifest.get("requires", {}).items():
            check = need.get("check") or f"command -v {program}"
            if self.runner.shell(plugin, environment, check, STEP_SECONDS).returncode != 0:
                raise Refused(f"{plugin.name} needs {program}, which is not here" + (f": {need['hint']}" if need.get("hint") else ""))

    def set_up(self, plugin: Plugin, environment: str) -> None:
        for step in plugin.manifest.get("setup", ()):
            ran = self.runner.shell(plugin, environment, step["run"], STEP_SECONDS)
            if ran.returncode != 0:
                raise Refused(f"{plugin.name}'s setup step {step.get('name', step['run'])!r} failed, so nothing is installed: {(ran.stderr or ran.stdout).strip()[-300:]}")

    def asked(self, plugin: Plugin, environment: str) -> dict:
        """The settings its installed command answers with, as a JSON object."""
        command = plugin.manifest.get("installed", "")
        if not command:
            return {}
        ran = self.runner.shell(plugin, environment, command, STEP_SECONDS)
        try:
            answer = json.loads(ran.stdout or "{}")
        except json.JSONDecodeError:
            answer = None
        if ran.returncode != 0 or not isinstance(answer, dict):
            raise Refused(f"{plugin.name}'s installed command {command!r} did not answer with its settings as a JSON object, so nothing is installed: {(ran.stderr or ran.stdout).strip()[-300:]}")
        return answer

    def undone(self, plugin: Plugin, had_data: bool) -> None:
        if not plugin.linked:
            shutil.rmtree(self.folders.of(plugin), ignore_errors=True)
        if not had_data:
            shutil.rmtree(self.config.home / "plugin-data" / plugin.name, ignore_errors=True)

    def upgrade_preview(self, name: str, ref: str) -> str:
        plugin = self.plugins.named(name)
        with self.staged(plugin.source, ref) as (folder, commit):
            changes = PluginChanges.manifest(plugin.manifest, asdict(self.same(plugin, self.reader.read(folder))))
            code = [] if plugin.linked else PluginChanges.code(self.folders.of(plugin), folder)
            return "\n".join([f"{name} from {plugin.commit_sha[:12] or plugin.source} to {commit[:12] or 'the folder as it is now'}", *(changes or ["nothing it runs, hears or holds changes"]), *(["", "the code:", *code] if code else [])])

    def upgrade(self, name: str, ref: str, by: Actor) -> Plugin:
        self.only_the_user(by, "upgrades")
        plugin = self.plugins.named(name)
        with self.staged(plugin.source, ref) as (folder, commit):
            manifest = self.same(plugin, self.reader.read(folder))
            if not plugin.linked:
                shutil.rmtree(self.folders.of(plugin))
                shutil.copytree(folder, self.folders.of(plugin), ignore=shutil.ignore_patterns(".git"))
            upgraded = self.plugins.save(plugin.with_(manifest=asdict(manifest), commit_sha=commit, hashes=self.hashes.of(self.folders.of(plugin), asdict(manifest)), waiting=""), by)
            self.skills.withdraw(upgraded)
            if upgraded.enabled:
                self.skills.publish(upgraded)
            return upgraded

    def enable(self, name: str, by: Actor) -> Plugin:
        """On, with its files' hashes taken anew: switching it on is the user's word that its code is read."""
        self.only_the_user(by, "switches on")
        plugin = self.plugins.named(name)
        self.skills.publish(plugin)
        return self.plugins.save(plugin.with_(enabled=True, hashes=self.hashes.of(self.folders.of(plugin), plugin.manifest)), by)

    def disable(self, name: str, by: Actor) -> Plugin:
        plugin = self.plugins.named(name)
        self.skills.withdraw(plugin)
        return self.plugins.save(plugin.with_(enabled=False), by)

    def remove(self, name: str, by: Actor) -> None:
        """Its row and its fetched copy go; its data folder stays."""
        plugin = self.plugins.named(name)
        self.skills.withdraw(plugin)
        if not plugin.linked:
            shutil.rmtree(self.folders.of(plugin), ignore_errors=True)
        self.plugins.delete(plugin, by)

    def purge(self, name: str, by: Actor) -> None:
        """Removed, and its data folder with it."""
        data = self.folders.data(self.plugins.named(name))
        self.remove(name, by)
        shutil.rmtree(data, ignore_errors=True)

    @staticmethod
    def same(plugin: Plugin, manifest: PluginManifest) -> PluginManifest:
        if manifest.name != plugin.name:
            raise Refused(f"{plugin.source} now holds the plugin {manifest.name}, not {plugin.name}: install it as a plugin of its own")
        return manifest

    @staticmethod
    def only_the_user(by: Actor, does: str) -> None:
        if by.kind != ActorKind.USER:
            raise Refused(f"only the user {does} a plugin: journal plugin propose <folder or git address> shows them a card to install it themselves")

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
        lines += [f"needs {program}" + (f": {need['hint']}" if need.get("hint") else "") for program, need in manifest.requires.items()]
        lines += [f"runs at install: {step.get('name', '')}: {step['run']}" for step in manifest.setup]
        if manifest.installed:
            lines.append(f"runs at install, its answer filling the settings: {manifest.installed}")
        if manifest.settings:
            lines.append(f"settings from {manifest.settings}")
        skills = ManifestReader.skill_names(folder, manifest)
        if skills:
            lines.append(f"skills {', '.join(skills)}")
        return "\n".join(lines)

