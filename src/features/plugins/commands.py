import json
import shutil

from engine.version import version
from features.parts import Command, Context
from features.plugins.answer import apply
from features.plugins.declared import Manifest, Setting, declared, settings_of
from features.plugins.lifecycle import called, difference, drop, place, restarted
from features.plugins.manifest import fill, read
from features.plugins.run import SECONDS, call
from features.plugins.source import alone, checked, data, environment, folder, log, logged, ports_for, prepared, preview, said_version, staged, token
from resources.base import Refused
from dataclasses import replace

VERSION = version()


def welcomed(journal, plugins, manifest: Manifest, env: dict) -> None:
    step = manifest.installed
    if not step:
        return
    root, name = plugins.record.root, manifest.name
    ok, reply = call(fill(step, env), folder(root, name), env, {"event": "plugin.installed"}, SECONDS)
    logged(root, name, f"installed {json.dumps(reply, ensure_ascii=False) if ok else reply}")
    if ok and isinstance(reply, dict):
        apply(plugins.record, journal, name, "", reply)


class Preview(Command):
    name = "preview"
    network = True

    def run(self, context: Context, plugins, source: str, ref: str = "") -> str:
        where, manifest, commit, linked = staged(plugins.record.root, source, ref, VERSION)
        try:
            return preview(manifest, source, commit)
        finally:
            drop(where, linked)


class Install(Command):
    name = "install"
    network = True

    def run(self, context: Context, plugins, source: str, ref: str = "", yes: bool = False):
        root = plugins.record.root
        where, manifest, commit, linked = staged(root, source, ref, VERSION)
        name, kept, held = manifest.name, False, None
        try:
            taken = next((r for r in plugins._standing() if called(r) == name), None)
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
            made = place(plugins, where, linked, manifest, source, ref, commit, secret, ports=ports)
            welcomed(context.journal, plugins, manifest, env)
            kept = True
        finally:
            if held:
                held.close()
            if not kept:
                drop(where, linked)
        context.journal.log("installed", name=name, source=source, commit=f" at {commit[:12]}" if commit else "", about=made.ref)
        return made


class Upgrade(Command):
    name = "upgrade"
    network = True

    def run(self, context: Context, plugins, n: int, ref: str = "", yes: bool = False, again: bool = False):
        row = plugins.load(n)
        root = plugins.record.root
        settings = settings_of(row)
        if row.linked:
            where = folder(root, called(row))
            manifest = read(where, VERSION)
            if again:
                ports = {**ports_for(root, manifest), **settings.ports}
                prepared(manifest, where, environment(root, manifest.name, manifest, row.token, ports, settings.chosen), log(root, manifest.name))
                restarted(root, manifest)
            return plugins.update(n, manifest=manifest.stored, version=said_version(where, manifest), abstract=manifest.description)
        where, manifest, commit, linked = staged(root, row.source, ref or row.revision, VERSION)
        kept = False
        try:
            if commit == row.commit and not ref and not again:
                return f"{called(row)} is already at {commit[:12]}; to run its setup again anyway, run it with --again --yes"
            if not yes:
                return f"{preview(manifest, row.source, commit)}\n\n{difference(declared(row), manifest)}\nNothing has changed yet. To upgrade to exactly this, run it again with --yes --ref {commit}"
            ports = {**ports_for(root, manifest), **settings.ports}
            env = environment(root, manifest.name, manifest, row.token, ports, settings.chosen)
            checked(manifest, where, env)
            prepared(manifest, where, env, log(root, manifest.name))
            place(plugins, where, linked, manifest, row.source, ref, commit, row.token, row=row, ports=ports)
            welcomed(context.journal, plugins, manifest, env)
            restarted(root, manifest)
            kept = True
        finally:
            if not kept:
                drop(where, linked)
        return plugins.load(n)


class Enable(Command):
    name = "enable"

    def run(self, context: Context, plugins, n: int):
        return plugins.update(n, enabled=True)


class Disable(Command):
    name = "disable"

    def run(self, context: Context, plugins, n: int):
        return plugins.update(n, enabled=False)


def allowed(key: str, setting: Setting, value: str) -> None:
    kind = setting.kind
    if kind == "flag" and value not in ("true", "false"):
        raise Refused(f"{key} is a switch: true or false")
    if kind == "number" and not value.lstrip("-").replace(".", "", 1).isdigit():
        raise Refused(f"{key} is a number, not {value!r}")
    if kind == "options" and value not in [str(option) for option in setting.options]:
        raise Refused(f"{key} is one of {', '.join(map(str, setting.options))}")


class Configure(Command):
    name = "configure"

    def run(self, context: Context, plugins, n: int, key: str, value: str = ""):
        row = plugins.load(n)
        manifest = declared(row)
        setting = manifest.setting(key)
        if setting is None:
            names = ", ".join(s.key for s in manifest.settings)
            raise Refused(f"{called(row)} has no setting {key!r}; it has {names if names else 'none'}")
        allowed(key, setting, value)
        settings = settings_of(row)
        updated = plugins.update(row.n, settings=replace(settings, chosen={**settings.chosen, key: value}).to_json())
        restarted(plugins.record.root, manifest)
        return updated


class Purge(Command):
    name = "purge"

    def run(self, context: Context, plugins, n: int):
        row = plugins.load(n)
        if not row.completed:
            raise Refused(f"plugin {n} is installed: remove it first")
        name = called(row)
        if not name:
            raise Refused(f"plugin {n} never named itself, so it kept nothing of its own")
        kept = data(plugins.record.root, name)
        shutil.rmtree(kept, ignore_errors=True)
        return f"everything {name} kept in {kept} is gone"


class ClearLog(Command):
    name = "clear_log"

    def run(self, context: Context, plugins, n: int):
        name = called(plugins.load(n))
        log(plugins.record.root, name).unlink(missing_ok=True)
        return f"{name}'s log is empty"
