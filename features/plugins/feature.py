import shutil
import time
from pathlib import Path

from controllers.types import Notifications, Plugins as Rows
from features.base import Feature, command, on, refuses
from features.plugins.manifest import fill, read
from features.plugins.payload import refusal
from features.plugins.run import call
from features.plugins.source import checked, data, environment, folder, home, log, prepared, preview, staged, token
from resources.base import Refused, SYSTEM

VERSION = (Path(__file__).resolve().parents[2] / "VERSION").read_text().strip() if (Path(__file__).resolve().parents[2] / "VERSION").is_file() else ""


class Plugins(Feature):
    name = "plugins"
    title_ = "Plugins"
    abstract_ = "A repository installed into the journal hears the bus, answers it, and may run services of its own"
    help_ = "Install one with journal plugin install <url>: its .journal-plugin/plugin.json says what it listens to, what it runs and which pages it shows. A plugin runs as you; install shows every command before it runs any."
    fixed = True
    EACH = 1.5
    LONGEST_EACH = 3.0
    ALTOGETHER = 5.0

    @refuses
    def guard(self, provider, record, hook, session) -> str:
        writes = provider.writes(hook)
        left = self.ALTOGETHER
        for row in Rows(record, actor=SYSTEM).all():
            asking = (row.manifest or {}).get("refuse")
            if not row.enabled or row.completed or not asking or left <= 0:
                continue
            if not writes and not (row.manifest or {}).get("reads"):
                continue
            name = self.called(row)
            where = folder(record.root, name)
            env = environment(record.root, name, row.manifest, row.token)
            seconds = min(float(row.manifest.get("refuse_seconds") or self.EACH), self.LONGEST_EACH, left)
            started = time.monotonic()
            ok, reply = call(fill(asking, env), where, env, refusal(record, hook, name, where, writes), seconds)
            left -= time.monotonic() - started
            if ok and isinstance(reply, dict) and str(reply.get("refuse") or "").strip():
                return f"{name}: {str(reply['refuse']).strip()}"
        return ""

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

    @command("plugin")
    def upgrade(self, plugins, n: int, ref: str = "", yes: bool = False):
        row = plugins.load(n)
        root = plugins.record.root
        if row.linked:
            manifest = read(folder(root, self.called(row)), VERSION)
            return plugins.update(n, manifest=manifest, version=manifest.get("version") or "", abstract=manifest.get("description") or "")
        where, manifest, commit, linked = staged(root, row.source, ref or row.revision, VERSION)
        kept = False
        try:
            if commit == row.commit and not ref:
                return f"{row.manifest['name']} is already at {commit[:12]}"
            if not yes:
                return f"{preview(manifest, row.source, commit)}\n\n{self.difference(row.manifest, manifest)}\nNothing has changed yet. To upgrade to exactly this, run it again with --yes --ref {commit}"
            env = environment(root, manifest["name"], manifest, row.token)
            checked(manifest, where, env)
            prepared(manifest, where, env, log(root, manifest["name"]))
            self.place(plugins, where, linked, manifest, row.source, ref, commit, row.token, row=row)
            kept = True
        finally:
            if not kept:
                self.drop(where, linked)
        return plugins.load(n)

    @command("plugin")
    def enable(self, plugins, n: int):
        return plugins.update(n, enabled=True)

    @command("plugin")
    def disable(self, plugins, n: int):
        return plugins.update(n, enabled=False)

    @command("plugin")
    def purge(self, plugins, n: int):
        row = plugins.load(n)
        if not row.completed:
            raise Refused(f"plugin {n} is installed: remove it first")
        name = self.called(row)
        if not name:
            raise Refused(f"plugin {n} never named itself, so it kept nothing of its own")
        kept = data(plugins.record.root, name)
        shutil.rmtree(kept, ignore_errors=True)
        return f"everything {name} kept in {kept} is gone"

    @on("plugin.completed")
    def removed(self, event, record) -> None:
        name = self.called(Rows(record, actor=SYSTEM).load(event.n))
        if name:
            self.clear(folder(record.root, name))

    def called(self, row) -> str:
        return str((row.manifest or {}).get("name") or "")

    def difference(self, before: dict, after: dict) -> str:
        was, now = self.runs(before), self.runs(after)
        gone = [line for line in was if line not in now]
        fresh = [line for line in now if line not in was]
        if not gone and not fresh:
            return "It runs the same commands as the version you have."
        return "\n".join(["What it runs changes:", *(f"  no longer: {line}" for line in gone), *(f"  now also: {line}" for line in fresh)])

    def runs(self, manifest: dict) -> list[str]:
        steps = [f"setup {step['name']}: {step['run']}" for step in manifest.get("setup") or []]
        services = [f"service {name}: {spec['run']}" for name, spec in (manifest.get("services") or {}).items()]
        handlers = [f"on {pattern}: {handler.get('post') or handler.get('run')}" for pattern, handler in (manifest.get("on") or {}).items()]
        return [*steps, *services, *handlers]

    def place(self, plugins, where: Path, linked: bool, manifest: dict, source: str, ref: str, commit: str, secret: str, row=None):
        name = manifest["name"]
        target = folder(plugins.record.root, name)
        home(plugins.record.root).mkdir(parents=True, exist_ok=True)
        self.clear(target)
        if linked:
            target.symlink_to(where)
        else:
            where.rename(target)
        kept = {"source": source, "revision": ref, "commit": commit, "version": manifest.get("version") or "", "linked": linked, "manifest": manifest}
        if row:
            return plugins.update(row.n, abstract=manifest.get("description") or "", **kept)
        return plugins.create(manifest.get("title") or name, abstract=manifest.get("description") or "", enabled=True, settings={}, token=secret, **kept)

    def drop(self, staging: Path, linked: bool) -> None:
        if not linked:
            shutil.rmtree(staging, ignore_errors=True)

    def clear(self, target: Path) -> None:
        if target.is_symlink():
            target.unlink()
        else:
            shutil.rmtree(target, ignore_errors=True)
