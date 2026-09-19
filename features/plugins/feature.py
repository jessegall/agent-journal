import shutil
from pathlib import Path

from controllers.types import Notifications, Plugins as Rows
from features.base import Feature, command
from features.plugins.source import data, environment, checked, folder, home, log, preview, prepared, staged, token
from resources.base import Refused, SYSTEM

VERSION = (Path(__file__).resolve().parents[2] / "VERSION").read_text().strip() if (Path(__file__).resolve().parents[2] / "VERSION").is_file() else ""


class Plugins(Feature):
    name = "plugins"
    title_ = "Plugins"
    abstract_ = "A repository installed into the journal hears the bus, answers it, and may run services of its own"
    help_ = "Install one with journal plugin install <url>: its .journal-plugin/plugin.json says what it listens to, what it runs and which pages it shows. A plugin runs as you; install shows every command before it runs any."
    fixed = True

    @command("plugin")
    def preview(self, plugins, source: str, ref: str = "") -> str:
        where, manifest, commit, linked = staged(plugins.record.root, source, ref, VERSION)
        try:
            return preview(manifest, source, commit)
        finally:
            self.drop(where, linked)

    @command("plugin")
    def install(self, plugins, source: str, ref: str = "", yes: bool = False):
        root = plugins.record.root
        where, manifest, commit, linked = staged(root, source, ref, VERSION)
        name, kept = manifest["name"], False
        try:
            taken = next((r for r in plugins.all() if r.manifest and r.manifest.get("name") == name and not r.completed), None)
            if taken:
                raise Refused(f"a plugin named {name} is installed from {taken.source}: remove it first")
            if not yes:
                return f"{preview(manifest, source, commit)}\n\nNothing is installed yet. To install exactly this, run it again with --yes" + (f" --ref {commit}" if commit else "")
            secret = token()
            env = environment(root, name, manifest, secret)
            checked(manifest, where, env)
            data(root, name).mkdir(parents=True, exist_ok=True)
            prepared(manifest, where, env, log(root, name))
            made = self.place(plugins, where, linked, manifest, source, ref, commit, secret)
            kept = True
        finally:
            if not kept:
                self.drop(where, linked)
        Notifications(plugins.record, actor=SYSTEM).create(f"Plugin {name} installed", brief=f"From {source}" + (f" at {commit[:12]}" if commit else "") + ".", about=made.ref)
        return made

    def place(self, plugins, where: Path, linked: bool, manifest: dict, source: str, ref: str, commit: str, secret: str):
        name = manifest["name"]
        target = folder(plugins.record.root, name)
        home(plugins.record.root).mkdir(parents=True, exist_ok=True)
        self.clear(target)
        if linked:
            target.symlink_to(where)
        else:
            where.rename(target)
        return plugins.create(manifest.get("title") or name, abstract=manifest.get("description") or "",
                              source=source, revision=ref, commit=commit, version=manifest.get("version") or "",
                              linked=linked, enabled=True, manifest=manifest, settings={}, token=secret)

    def drop(self, staging: Path, linked: bool) -> None:
        if not linked:
            shutil.rmtree(staging, ignore_errors=True)

    def clear(self, target: Path) -> None:
        if target.is_symlink():
            target.unlink()
        else:
            shutil.rmtree(target, ignore_errors=True)
