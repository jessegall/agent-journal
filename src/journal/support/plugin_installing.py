import json
import shutil
import subprocess
import tempfile
import time
from contextlib import contextmanager
from dataclasses import asdict
from pathlib import Path
from typing import Iterator

from journal.config import Config
from journal.features.plugins.support.plugin_preview import PluginPreview
from journal.features.plugins.support.preview_row import PreviewRow
from journal.features.plugins.support.manifest_reader import ManifestReader
from journal.features.plugins.support.plugin_folders import PluginFolders
from journal.features.plugins.support.plugin_changes import PluginChanges
from journal.features.plugins.support.plugin_hashes import PluginHashes
from journal.features.plugins.support.plugin_runner import PluginRunner
from journal.features.plugins.support.plugin_services import PluginServices
from journal.features.plugins.support.plugin_settings import PluginSettings
from journal.features.plugins.support.plugin_skills import PluginSkills
from journal.support.actor import Actor
from journal.support.actor_kind import ActorKind
from journal.models.plugin import Plugin
from journal.support.plugin_manifest import PluginManifest
from journal.support.rejection import Rejection
from journal.repositories.dashboard_rows import DashboardRows
from journal.support.missing_row import MissingRow
from journal.repositories.plugins import Plugins

DOWNLOAD_SECONDS = 120
STEP_SECONDS = 300


class PluginInstalling:
    """A plugin taken in: a folder linked where it lies, or a git address fetched into the journal's plugins folder; its manifest read and checked, a preview of all it will run, and only then its row and data folder."""

    def __init__(self, config: Config, reader: ManifestReader, plugins: Plugins, folders: PluginFolders, hashes: PluginHashes, settings: PluginSettings, skills: PluginSkills, runner: PluginRunner, services: PluginServices, dashboard: DashboardRows) -> None:
        self.config, self.reader, self.plugins, self.folders, self.hashes, self.settings, self.skills, self.runner = config, reader, plugins, folders, hashes, settings, skills, runner
        self.services, self.dashboard = services, dashboard

    def preview(self, source: str) -> PluginPreview:
        with self.staged(source) as (folder, commit):
            manifest = self.reader.read(folder)
            return PluginPreview(manifest.name, manifest.title or manifest.name, manifest.version, manifest.description, source, commit, self.rows(manifest, folder), linked=Path(source).is_dir())

    def install(self, source: str, environment: str, actor: Actor) -> Plugin:
        self.require_user(actor, "installs")
        with self.staged(source) as (folder, commit):
            manifest = self.reader.read(folder)
            self.free(manifest.name)
            linked = Path(source).is_dir()
            plugin = Plugin(name=manifest.name, source=str(folder) if linked else source, commit_sha=commit, release="" if linked else self.tag(folder), linked=linked, manifest=manifest)
            prior_data = (self.config.home / "plugin-data" / plugin.name).is_dir()
            if not linked:
                shutil.copytree(folder, self.folders.folder(plugin), ignore=shutil.ignore_patterns(".git"))
            try:
                self.required(plugin, environment)
                self.prepare(plugin, environment)
                filled = self.question(plugin, environment)
            except Rejection:
                self.undone(plugin, prior_data)
                raise
            settings = self.settings.started(plugin, actor)
            hashes = self.hashes.digest(self.folders.folder(plugin), plugin.manifest)
            saved = self.plugins.save(plugin.with_(settings={**settings, **{k: v for k, v in filled.items() if k in settings and not isinstance(settings[k], dict)}}, hashes=hashes), actor)
            self.folders.data(saved)
            self.skills.publish(saved)
            self.services.start(saved)
            return saved

    def required(self, plugin: Plugin, environment: str) -> None:
        for program, need in plugin.manifest.requires.items():
            check = need.check or f"command -v {program}"
            if self.runner.shell(plugin, environment, check, STEP_SECONDS).returncode != 0:
                raise Rejection(f"{plugin.name} needs {program}, which is not here" + (f": {need.hint}" if need.hint else ""))

    def prepare(self, plugin: Plugin, environment: str) -> None:
        for step in plugin.manifest.setup:
            completed = self.runner.shell(plugin, environment, step.run, STEP_SECONDS)
            if completed.returncode != 0:
                raise Rejection(f"{plugin.name}'s setup step {step.called!r} failed, so nothing is installed: {(completed.stderr or completed.stdout).strip()[-300:]}")

    def question(self, plugin: Plugin, environment: str) -> dict:
        command = plugin.manifest.installed
        if not command:
            return {}
        completed = self.runner.shell(plugin, environment, command, STEP_SECONDS)
        try:
            answer = json.loads(completed.stdout or "{}")
        except json.JSONDecodeError:
            answer = None
        if completed.returncode != 0 or not isinstance(answer, dict):
            raise Rejection(f"{plugin.name}'s installed command {command!r} did not answer with its settings as a JSON object, so nothing is installed: {(completed.stderr or completed.stdout).strip()[-300:]}")
        return answer

    def undone(self, plugin: Plugin, prior_data: bool) -> None:
        if not plugin.linked:
            shutil.rmtree(self.folders.folder(plugin), ignore_errors=True)
        if not prior_data:
            shutil.rmtree(self.config.home / "plugin-data" / plugin.name, ignore_errors=True)

    def upgrade_preview(self, name: str, ref: str | None) -> PluginPreview:
        plugin = self.plugins.lookup(name)
        with self.staged(plugin.source, ref) as (folder, commit):
            manifest = self.same(plugin, self.reader.read(folder))
            changes = PluginChanges.manifest(asdict(plugin.manifest), asdict(manifest))
            code = [] if plugin.linked else PluginChanges.code(self.folders.folder(plugin), folder)
            return PluginPreview(name, manifest.title or name, manifest.version, manifest.description, plugin.source, commit, self.rows(manifest, folder), previous=plugin.commit_sha,
                                 changes=tuple(changes), code=tuple(code), current=not changes and not code)

    def upgrade(self, name: str, ref: str | None, environment: str, actor: Actor) -> Plugin:
        plugin = self.plugins.lookup(name)
        with self.staged(plugin.source, ref) as (folder, commit):
            upgraded = plugin.with_(manifest=self.same(plugin, self.reader.read(folder)), commit_sha=commit, release="" if plugin.linked else self.tag(folder), waiting="")
            self.services.stop(plugin)
            if not plugin.linked:
                self.replaced(plugin, upgraded, folder, environment)
            saved = self.plugins.save(upgraded.with_(hashes=self.hashes.digest(self.folders.folder(upgraded), upgraded.manifest)), actor)
            self.skills.withdraw(saved)
            if saved.enabled:
                self.skills.publish(saved)
                self.services.start(saved)
            return saved

    def replaced(self, plugin: Plugin, upgraded: Plugin, folder: Path, environment: str) -> None:
        target = self.folders.folder(plugin)
        stored = target.with_name(f"{target.name}.before-upgrade")
        shutil.rmtree(stored, ignore_errors=True)
        target.rename(stored)
        shutil.copytree(folder, target, ignore=shutil.ignore_patterns(".git"))
        try:
            self.required(upgraded, environment)
            self.prepare(upgraded, environment)
        except Rejection:
            shutil.rmtree(target)
            stored.rename(target)
            if plugin.enabled:
                self.services.start(plugin)
            raise
        shutil.rmtree(stored)

    def enable(self, name: str, actor: Actor) -> Plugin:
        self.require_user(actor, "switches on")
        plugin = self.plugins.lookup(name)
        self.skills.publish(plugin)
        self.services.start(plugin)
        return self.plugins.save(plugin.with_(enabled=True, hashes=self.hashes.digest(self.folders.folder(plugin), plugin.manifest)), actor)

    def disable(self, name: str, actor: Actor) -> Plugin:
        plugin = self.plugins.lookup(name)
        self.skills.withdraw(plugin)
        self.services.stop(plugin)
        return self.plugins.save(plugin.with_(enabled=False), actor)

    def remove(self, name: str, actor: Actor) -> None:
        plugin = self.plugins.lookup(name)
        self.skills.withdraw(plugin)
        self.services.stop(plugin)
        if not plugin.linked:
            shutil.rmtree(self.folders.folder(plugin), ignore_errors=True)
        self.plugins.delete(plugin, actor)

    def purge(self, name: str, actor: Actor) -> None:
        data = self.folders.data(self.plugins.lookup(name))
        self.remove(name, actor)
        shutil.rmtree(data, ignore_errors=True)
        for line in self.dashboard.rows(name):
            self.dashboard.delete(line, actor)

    @staticmethod
    def clear_stale_fetches(home: Path) -> None:
        for stale in home.glob(".fetching-*"):
            if time.time() - stale.stat().st_mtime > 2 * DOWNLOAD_SECONDS:
                shutil.rmtree(stale, ignore_errors=True)

    @staticmethod
    def tag(folder: Path) -> str:
        described = subprocess.run(["git", "-C", str(folder), "describe", "--tags", "--exact-match", "HEAD"], capture_output=True, text=True, timeout=DOWNLOAD_SECONDS)
        return described.stdout.strip() if described.returncode == 0 else ""

    @staticmethod
    def same(plugin: Plugin, manifest: PluginManifest) -> PluginManifest:
        if manifest.name != plugin.name:
            raise Rejection(f"{plugin.source} now holds the plugin {manifest.name}, not {plugin.name}: install it as a plugin of its own")
        return manifest

    @staticmethod
    def require_user(actor: Actor, does: str) -> None:
        if actor.kind != ActorKind.USER:
            raise Rejection(f"only the user {does} a plugin: journal plugin propose <folder or git address> shows them a card to install it themselves")

    def free(self, name: str) -> None:
        try:
            self.plugins.lookup(name)
        except MissingRow:
            return
        raise Rejection(f"a plugin named {name} is installed already: journal plugin upgrade {name}")

    @contextmanager
    def staged(self, source: str, ref: str | None = None) -> Iterator[tuple[Path, str]]:
        if Path(source).is_dir():
            yield Path(source).resolve(), ""
            return
        home = self.config.home / "plugins"
        home.mkdir(parents=True, exist_ok=True)
        self.clear_stale_fetches(home)
        temporary = Path(tempfile.mkdtemp(prefix="journal-plugin-fetch-"))
        try:
            shallow = [] if ref is not None else ["--depth", "1"]
            fetched = subprocess.run(["git", "clone", "--quiet", *shallow, source, str(temporary / "plugin")], capture_output=True, text=True, timeout=DOWNLOAD_SECONDS)
            if fetched.returncode == 0 and ref is not None:
                fetched = subprocess.run(["git", "-C", str(temporary / "plugin"), "checkout", "--quiet", ref], capture_output=True, text=True, timeout=DOWNLOAD_SECONDS)
            if fetched.returncode != 0:
                raise Rejection(f"could not fetch {source}{' at ' + ref if ref is not None else ''}: {fetched.stderr.strip()[-300:]}")
            commit = subprocess.run(["git", "-C", str(temporary / "plugin"), "rev-parse", "HEAD"], capture_output=True, text=True, timeout=DOWNLOAD_SECONDS).stdout.strip()
            yield temporary / "plugin", commit
        finally:
            shutil.rmtree(temporary, ignore_errors=True)

    @staticmethod
    def rows(manifest: PluginManifest, folder: Path) -> tuple[PreviewRow, ...]:
        rows = (*(PreviewRow("needs", program, need.hint) for program, need in manifest.requires.items()),
                *(PreviewRow("setup", step.name, step.run) for step in manifest.setup),
                PreviewRow("installed", "fills its settings", manifest.installed),
                PreviewRow("program", "for each event it hears, from its folder", manifest.program),
                *(PreviewRow("service", s.name, " ".join(s.command) + (f"  (where {s.condition})" if s.condition else "")) for s in manifest.services),
                PreviewRow("hears", "events", ", ".join(manifest.events) or "nothing"),
                PreviewRow("holds", "before the agent continues", ", ".join(window.as_text() for window in manifest.blocks) or "nothing"),
                *(PreviewRow("skill", name) for name in ManifestReader.skill_names(folder, manifest)))
        return tuple(row for row in rows if row.kind != "installed" or row.command)

