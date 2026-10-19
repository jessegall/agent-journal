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
from journal.features.plugins.plugin_preview import PluginPreview
from journal.features.plugins.preview_row import PreviewRow
from journal.features.plugins.manifest_reader import ManifestReader
from journal.features.plugins.plugin_folders import PluginFolders
from journal.features.plugins.plugin_changes import PluginChanges
from journal.features.plugins.plugin_hashes import PluginHashes
from journal.features.plugins.plugin_runner import PluginRunner
from journal.features.plugins.plugin_services import PluginServices
from journal.features.plugins.plugin_settings import PluginSettings
from journal.features.plugins.plugin_skills import PluginSkills
from journal.models.actor import Actor
from journal.models.actor_kind import ActorKind
from journal.models.plugin import Plugin
from journal.models.plugin_manifest import PluginManifest
from journal.refused import Refused
from journal.repositories.dashboard_rows import DashboardRows
from journal.repositories.not_found import NotFound
from journal.repositories.plugins import Plugins

FETCH_SECONDS = 120
STEP_SECONDS = 300
"""The longest a requirement's check, a setup step or the installed command may run."""


class Installing:
    """A plugin taken in: a folder linked where it lies, or a git address fetched into the journal's plugins folder; its manifest read and checked, a preview of all it will run, and only then its row and data folder."""

    def __init__(self, config: Config, reader: ManifestReader, plugins: Plugins, folders: PluginFolders, hashes: PluginHashes, settings: PluginSettings, skills: PluginSkills, runner: PluginRunner, services: PluginServices, dashboard: DashboardRows) -> None:
        self.config, self.reader, self.plugins, self.folders, self.hashes, self.settings, self.skills, self.runner = config, reader, plugins, folders, hashes, settings, skills, runner
        self.services, self.dashboard = services, dashboard

    def preview(self, source: str) -> PluginPreview:
        """What the plugin is and, row by row, everything it would run, hear and hold."""
        with self.staged(source) as (folder, commit):
            manifest = self.reader.read(folder)
            return PluginPreview(manifest.name, manifest.title or manifest.name, manifest.version, manifest.description, source, commit, self.rows(manifest, folder), linked=Path(source).is_dir())

    def install(self, source: str, environment: str, by: Actor) -> Plugin:
        """Its requirements checked, its setup steps run in order and its installed command asked, all before its row is made; a failure leaves nothing."""
        self.only_the_user(by, "installs")
        with self.staged(source) as (folder, commit):
            manifest = self.reader.read(folder)
            self.free(manifest.name)
            linked = Path(source).is_dir()
            plugin = Plugin(name=manifest.name, source=str(folder) if linked else source, commit_sha=commit, release="" if linked else self.tag_at(folder), linked=linked, manifest=manifest)
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
            hashes = self.hashes.of(self.folders.of(plugin), plugin.manifest)
            saved = self.plugins.save(plugin.with_(settings={**settings, **{k: v for k, v in filled.items() if k in settings and not isinstance(settings[k], dict)}}, hashes=hashes), by)
            self.folders.data(saved)
            self.skills.publish(saved)
            self.services.start(saved)
            return saved

    def required(self, plugin: Plugin, environment: str) -> None:
        for program, need in plugin.manifest.requires.items():
            check = need.check or f"command -v {program}"
            if self.runner.shell(plugin, environment, check, STEP_SECONDS).returncode != 0:
                raise Refused(f"{plugin.name} needs {program}, which is not here" + (f": {need.hint}" if need.hint else ""))

    def set_up(self, plugin: Plugin, environment: str) -> None:
        for step in plugin.manifest.setup:
            ran = self.runner.shell(plugin, environment, step.run, STEP_SECONDS)
            if ran.returncode != 0:
                raise Refused(f"{plugin.name}'s setup step {step.called!r} failed, so nothing is installed: {(ran.stderr or ran.stdout).strip()[-300:]}")

    def asked(self, plugin: Plugin, environment: str) -> dict:
        """The settings its installed command answers with, as a JSON object."""
        command = plugin.manifest.installed
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

    def upgrade_preview(self, name: str, ref: str | None) -> PluginPreview:
        """The preview of the plugin at the commit asked for, with what changes in its manifest and its code."""
        plugin = self.plugins.named(name)
        with self.staged(plugin.source, ref) as (folder, commit):
            manifest = self.same(plugin, self.reader.read(folder))
            changes = PluginChanges.manifest(asdict(plugin.manifest), asdict(manifest))
            code = [] if plugin.linked else PluginChanges.code(self.folders.of(plugin), folder)
            return PluginPreview(name, manifest.title or name, manifest.version, manifest.description, plugin.source, commit, self.rows(manifest, folder), was=plugin.commit_sha,
                                 changes=tuple(changes), code=tuple(code), current=not changes and not code)

    def upgrade(self, name: str, ref: str | None, environment: str, by: Actor) -> Plugin:
        """A fetched plugin's folder replaced and its setup run again, its old folder put back if the setup fails; a linked one read where it lies."""
        self.only_the_user(by, "upgrades")
        plugin = self.plugins.named(name)
        with self.staged(plugin.source, ref) as (folder, commit):
            upgraded = plugin.with_(manifest=self.same(plugin, self.reader.read(folder)), commit_sha=commit, release="" if plugin.linked else self.tag_at(folder), waiting="")
            self.services.stop(plugin)
            if not plugin.linked:
                self.replaced(plugin, upgraded, folder, environment)
            saved = self.plugins.save(upgraded.with_(hashes=self.hashes.of(self.folders.of(upgraded), upgraded.manifest)), by)
            self.skills.withdraw(saved)
            if saved.enabled:
                self.skills.publish(saved)
                self.services.start(saved)
            return saved

    def replaced(self, plugin: Plugin, upgraded: Plugin, folder: Path, environment: str) -> None:
        target = self.folders.of(plugin)
        kept = target.with_name(f"{target.name}.before-upgrade")
        shutil.rmtree(kept, ignore_errors=True)
        target.rename(kept)
        shutil.copytree(folder, target, ignore=shutil.ignore_patterns(".git"))
        try:
            self.required(upgraded, environment)
            self.set_up(upgraded, environment)
        except Refused:
            shutil.rmtree(target)
            kept.rename(target)
            if plugin.enabled:
                self.services.start(plugin)
            raise
        shutil.rmtree(kept)

    def enable(self, name: str, by: Actor) -> Plugin:
        """On, with its files' hashes taken anew: switching it on is the user's word that its code is read."""
        self.only_the_user(by, "switches on")
        plugin = self.plugins.named(name)
        self.skills.publish(plugin)
        self.services.start(plugin)
        return self.plugins.save(plugin.with_(enabled=True, hashes=self.hashes.of(self.folders.of(plugin), plugin.manifest)), by)

    def disable(self, name: str, by: Actor) -> Plugin:
        plugin = self.plugins.named(name)
        self.skills.withdraw(plugin)
        self.services.stop(plugin)
        return self.plugins.save(plugin.with_(enabled=False), by)

    def remove(self, name: str, by: Actor) -> None:
        """Its row and its fetched copy go; its data folder stays."""
        plugin = self.plugins.named(name)
        self.skills.withdraw(plugin)
        self.services.stop(plugin)
        if not plugin.linked:
            shutil.rmtree(self.folders.of(plugin), ignore_errors=True)
        self.plugins.delete(plugin, by)

    def purge(self, name: str, by: Actor) -> None:
        """Removed, and its data folder and its dashboard's lines with it."""
        data = self.folders.data(self.plugins.named(name))
        self.remove(name, by)
        shutil.rmtree(data, ignore_errors=True)
        for line in self.dashboard.of(name):
            self.dashboard.delete(line, by)

    @staticmethod
    def clear_stale_fetches(home: Path) -> None:
        """A fetch folder in the plugins folder, older than any fetch may take, was left there by a killed fetch before fetches moved outside the project: it goes."""
        for stale in home.glob(".fetching-*"):
            if time.time() - stale.stat().st_mtime > 2 * FETCH_SECONDS:
                shutil.rmtree(stale, ignore_errors=True)

    @staticmethod
    def tag_at(folder: Path) -> str:
        """The release tag the fetched commit carries, or none."""
        described = subprocess.run(["git", "-C", str(folder), "describe", "--tags", "--exact-match", "HEAD"], capture_output=True, text=True, timeout=FETCH_SECONDS)
        return described.stdout.strip() if described.returncode == 0 else ""

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
    def staged(self, source: str, ref: str | None = None) -> Iterator[tuple[Path, str]]:
        """A folder is read where it lies; a git address is fetched at the commit asked for, or its newest, into a folder of the system's outside the project, so the agent's program never sees a whole repository appear in the tree it watches, and gone once read."""
        if Path(source).is_dir():
            yield Path(source).resolve(), ""
            return
        home = self.config.home / "plugins"
        home.mkdir(parents=True, exist_ok=True)
        self.clear_stale_fetches(home)
        temporary = Path(tempfile.mkdtemp(prefix="journal-plugin-fetch-"))
        try:
            shallow = [] if ref is not None else ["--depth", "1"]
            fetched = subprocess.run(["git", "clone", "--quiet", *shallow, source, str(temporary / "plugin")], capture_output=True, text=True, timeout=FETCH_SECONDS)
            if fetched.returncode == 0 and ref is not None:
                fetched = subprocess.run(["git", "-C", str(temporary / "plugin"), "checkout", "--quiet", ref], capture_output=True, text=True, timeout=FETCH_SECONDS)
            if fetched.returncode != 0:
                raise Refused(f"could not fetch {source}{' at ' + ref if ref is not None else ''}: {fetched.stderr.strip()[-300:]}")
            commit = subprocess.run(["git", "-C", str(temporary / "plugin"), "rev-parse", "HEAD"], capture_output=True, text=True, timeout=FETCH_SECONDS).stdout.strip()
            yield temporary / "plugin", commit
        finally:
            shutil.rmtree(temporary, ignore_errors=True)

    @staticmethod
    def rows(manifest: PluginManifest, folder: Path) -> tuple[PreviewRow, ...]:
        """Each thing it runs, hears, holds, needs and brings, as a kind, a label and the command or names; an installed command it has none of is no row."""
        rows = (*(PreviewRow("needs", program, need.hint) for program, need in manifest.requires.items()),
                *(PreviewRow("setup", step.name, step.run) for step in manifest.setup),
                PreviewRow("installed", "fills its settings", manifest.installed),
                PreviewRow("program", "for each event it hears, from its folder", manifest.program),
                *(PreviewRow("service", s.name, " ".join(s.command) + (f"  (where {s.when})" if s.when else "")) for s in manifest.services),
                PreviewRow("hears", "events", ", ".join(manifest.hears) or "nothing"),
                PreviewRow("holds", "before the agent continues", ", ".join(manifest.holds) or "nothing"),
                *(PreviewRow("skill", name) for name in ManifestReader.skill_names(folder, manifest)))
        return tuple(row for row in rows if row.kind != "installed" or row.command)

