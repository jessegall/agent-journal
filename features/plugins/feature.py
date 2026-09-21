import re
import shutil
import threading
import time
from pathlib import Path

from controllers.types import Plugins as Rows
from engine.services import UP, want
from features.base import Feature, Line, formats, command, event, gate
from features.plugins.host import watch
from features.plugins.manifest import fill, read
from features.plugins.payload import refusal
from features.plugins import services
from features.plugins.run import call
from features.plugins.source import alone, checked, data, environment, folder, home, log, ports_for, prepared, preview, said_version, staged, token
from resources.base import Refused, SYSTEM
from engine.version import version
from features.statusline import commands

VERSION = version()


class Plugins(Feature):
    name = "plugins"
    title_ = "Plugins"
    abstract_ = "A repository installed into the journal hears the bus, answers it, and may run services of its own"
    help_ = "The servers a plugin declares are kept up while the session runs and die with it; one that gives up is said once over the chat, and journal services list|start|stop|restart|log <plugin>.<service> inspects them. Install one with journal plugin install <url>: its .journal-plugin/plugin.json says what it listens to, what it runs and which pages it shows. A plugin runs as you; install shows every command before it runs any. It writes back by calling the journal itself, or by appending journal commands to the file at $JOURNAL_QUEUE, one per line, which the host drains a few at a time."
    fixed = True
    lines = {"plugin": Line("{{title}}", "{{brief}}"),
             "installed": Line("Plugin {{name}} installed", "From {{source}}{{commit}}."),
             "failing": Line("Plugin {{name}} is failing", "{{why}}\nIts log is {{log}}."),
             "stopped": Line("Service {{name}} is not running", "{{why}}\nIts log is {{log}}.")}
    EACH = 1.5
    LONGEST_EACH = 3.0
    ALTOGETHER = 5.0

    def chat_rules(self, record) -> list:
        memo, key = getattr(record, "memo", None), ("chat rules",)
        if memo is not None and key in memo:
            return memo[key]
        rules = [(rule["find"], rule["as"]) for row in Rows(record, actor=SYSTEM)._standing() if row.enabled
                 for rule in (row.manifest or {}).get("chat") or []]
        if memo is not None:
            memo[key] = rules
        return rules

    @formats
    def plugin_rules(self, text: str, record) -> str:
        said = text
        for find, becomes in self.chat_rules(record) if record else []:
            said = re.sub(find, becomes, said)
        return said

    def host(self, root: Path) -> None:
        threading.Thread(target=watch, args=(Path(root), self.journal), daemon=True).start()
        services.watch(Path(root), self.enabled, self.journal)

    @gate
    def guard(self, provider, record, hook, session) -> str:
        writes = commands.writes(hook)
        left = self.ALTOGETHER
        for row in Rows(record, actor=SYSTEM)._every():
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
        name, kept, held = manifest["name"], False, None
        try:
            taken = next((r for r in plugins._standing() if r.manifest and r.manifest.get("name") == name), None)
            if taken:
                raise Refused(f"a plugin named {name} is installed from {taken.source}: remove it first")
            if not yes:
                return f"{preview(manifest, source, commit)}\n\nNothing is installed yet. To install exactly this, run it again with --yes" + (f" --ref {commit}" if commit else "")
            held = alone(root, name)
            secret = token()
            ports = ports_for(root, manifest)
            env = environment(root, name, manifest, secret, ports)
            checked(manifest, where, env)
            data(root, name).mkdir(parents=True, exist_ok=True)
            prepared(manifest, where, env, log(root, name))
            made = self.place(plugins, where, linked, manifest, source, ref, commit, secret, ports=ports)
            kept = True
        finally:
            if held:
                held.close()
            if not kept:
                self.drop(where, linked)
        self.journal.log(plugins.record, "installed", name=name, source=source, commit=f" at {commit[:12]}" if commit else "", about=made.ref)
        return made

    @command("plugin")
    def upgrade(self, plugins, n: int, ref: str = "", yes: bool = False, again: bool = False):
        row = plugins.load(n)
        root = plugins.record.root
        if row.linked:
            where = folder(root, self.called(row))
            manifest = read(where, VERSION)
            if again:
                ports = {**ports_for(root, manifest), **((row.settings or {}).get("ports") or {})}
                prepared(manifest, where, environment(root, manifest["name"], manifest, row.token, ports), log(root, manifest["name"]))
                self.restarted(root, manifest)
            return plugins.update(n, manifest=manifest, version=said_version(where, manifest), abstract=manifest.get("description") or "")
        where, manifest, commit, linked = staged(root, row.source, ref or row.revision, VERSION)
        kept = False
        try:
            if commit == row.commit and not ref and not again:
                return f"{row.manifest['name']} is already at {commit[:12]}; to run its setup again anyway, run it with --again --yes"
            if not yes:
                return f"{preview(manifest, row.source, commit)}\n\n{self.difference(row.manifest, manifest)}\nNothing has changed yet. To upgrade to exactly this, run it again with --yes --ref {commit}"
            ports = {**ports_for(root, manifest), **((row.settings or {}).get("ports") or {})}
            env = environment(root, manifest["name"], manifest, row.token, ports)
            checked(manifest, where, env)
            prepared(manifest, where, env, log(root, manifest["name"]))
            self.place(plugins, where, linked, manifest, row.source, ref, commit, row.token, row=row, ports=ports)
            self.restarted(root, manifest)
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

    @event("plugin.completed")
    def removed(self, event, record) -> None:
        rows = Rows(record, actor=SYSTEM)
        name = self.called(rows.load(event.n))
        still = any(r.n != event.n and self.called(r) == name for r in rows._standing())
        if name and not still:
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
        servers = [f"service {name}: {spec['run']}" for name, spec in (manifest.get("services") or {}).items()]
        handlers = [f"on {pattern}: {handler.get('post') or handler.get('run')}" for pattern, handler in (manifest.get("on") or {}).items()]
        return [*steps, *servers, *handlers]

    def place(self, plugins, where: Path, linked: bool, manifest: dict, source: str, ref: str, commit: str, secret: str, row=None, ports: dict | None = None):
        name = manifest["name"]
        target = folder(plugins.record.root, name)
        home(plugins.record.root).mkdir(parents=True, exist_ok=True)
        self.clear(target)
        if linked:
            target.symlink_to(where)
        else:
            where.rename(target)
        kept = {"source": source, "revision": ref, "commit": commit, "version": said_version(target, manifest), "linked": linked, "manifest": manifest}
        if row:
            return plugins.update(row.n, abstract=manifest.get("description") or "", settings={**(row.settings or {}), "ports": ports or {}}, **kept)
        return plugins.create(manifest.get("title") or name, abstract=manifest.get("description") or "", enabled=True, settings={"ports": ports or {}}, token=secret, **kept)

    def restarted(self, root: Path, manifest: dict) -> None:
        for service in (manifest.get("services") or {}):
            want(root, f"{manifest['name']}.{service}", UP, nonce=time.time())

    def drop(self, staging: Path, linked: bool) -> None:
        if not linked:
            shutil.rmtree(staging, ignore_errors=True)

    def clear(self, target: Path) -> None:
        if target.is_symlink():
            target.unlink()
        else:
            shutil.rmtree(target, ignore_errors=True)
