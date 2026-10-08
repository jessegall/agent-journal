import shutil

from controllers.base import Arguments
from engine.version import version
from features.parts import Command, Context
from features.plugins.answer import Posting, raised
from features.plugins.declared import called, declared, named, settings_of, settings_choosing
from features.plugins.environment import environment, ports_for
from features.plugins.fitting import InstallMark
from features.plugins.lifecycle import difference, fetched, install_staged, reread, restarted
from features.plugins.manifest import read
from features.plugins.paths import data, folder, log
from features.plugins.preview import preview
from features.plugins.setup import prepared
from features.plugins.staging import alone, followed, token
from controllers.types import Agents
from resources.base import Refused, SYSTEM, USER

VERSION = version()


class Preview(Command):
    name = "preview"
    network = True

    def run(self, context: Context, plugins, source: str, ref: str = "") -> str:
        with fetched(plugins.record.root, source, ref) as stage:
            return preview(stage.manifest, source, stage.commit)


class Install(Command):
    name = "install"
    network = True

    def run(self, context: Context, plugins, source: str, ref: str = "", yes: bool = False):
        if not yes:
            return self.install(context, plugins, source, ref, yes)
        mark = InstallMark.begin(plugins, source)
        try:
            made = self.install(context, plugins, source, ref, yes)
        except Refused as error:
            mark.failed(error)
            raise
        mark.installed(made)
        return made

    def install(self, context: Context, plugins, source: str, ref: str, yes: bool):
        root = plugins.record.root
        with fetched(root, source, ref) as stage:
            name = stage.manifest.name
            taken = named(plugins, name)
            if taken:
                raise Refused(f"a plugin named {name} is installed from {taken.source}: remove it first")
            if not yes:
                return f"{preview(stage.manifest, source, stage.commit)}\n\nNothing is installed yet. To install exactly this, run it again with --yes" + (f" --ref {stage.commit}" if stage.commit else "")
            with alone(root, name):
                made = install_staged(context.journal, plugins, stage, source, ref, token(), ports_for(root, stage.manifest))
        context.journal.log("installed", name=name, source=source, commit=f" at {stage.commit[:12]}" if stage.commit else "", about=made.ref)
        return made


class Upgrade(Command):
    name = "upgrade"
    network = True

    def run(self, context: Context, plugins, n: int, ref: str | None = None, yes: bool = False, again: bool = False):
        row = plugins.load(n)
        root = plugins.record.root
        settings = settings_of(row)
        if row.linked:
            where = folder(root, called(row))
            manifest = read(where, VERSION)
            if again:
                ports = {**ports_for(root, manifest), **settings.ports}
                prepared(manifest, where, environment(root, manifest.name, manifest, row.token, ports, settings.chosen), log(root, manifest.name))
            return reread(plugins, row)
        with fetched(root, row.source, followed(row.revision) if ref is None else ref) as stage:
            manifest, commit = stage.manifest, stage.commit
            if commit == row.commit and ref is None and not again:
                return f"{called(row)} is already at {commit[:12]}; to run its setup again anyway, run it with --again --yes"
            if not yes:
                return f"{preview(manifest, row.source, commit)}\n\n{difference(declared(row), manifest)}\nNothing has changed yet. To upgrade to exactly this, run it again with --yes --ref {commit}"
            ports = {**ports_for(root, manifest), **settings.ports}
            install_staged(context.journal, plugins, stage, row.source, "" if ref is None else ref, row.token, ports, settings.chosen, row)
        return plugins.load(n)


class Enable(Command):
    name = "enable"

    def run(self, context: Context, plugins, n: int):
        return plugins.update(n, enabled=True)


class Disable(Command):
    name = "disable"

    def run(self, context: Context, plugins, n: int):
        return plugins.update(n, enabled=False)


class Configure(Command):
    name = "configure"

    def run(self, context: Context, plugins, n: int, key: str, value: str = ""):
        row = plugins.load(n)
        manifest = declared(row)
        setting = manifest.setting(key)
        if setting is None:
            names = ", ".join(s.key for s in manifest.settings)
            raise Refused(f"{called(row)} has no setting {key!r}; it has {names if names else 'none'}")
        setting.check(value)
        if setting.is_secret() and plugins.actor != USER:
            raise Refused(f"only you give {called(row)} a secret, under Settings, Plugins in the viewer")
        updated = plugins.update(row.n, settings=settings_choosing(row, {key: value}))
        restarted(plugins.record.root, manifest)
        return updated

    def runs_commands(self, controller, arguments: Arguments) -> bool:
        row = controller.load(arguments.n)
        setting = declared(row).setting(arguments.key)
        return setting is not None and setting.is_command and str(arguments.value) != str(settings_of(row).chosen.get(arguments.key, setting.default))


class Raise(Command):
    name = "raise"

    def run(self, context: Context, plugins, plugin: str, event: str, brief: str, open: str = "", key: str = ""):
        raised(plugins.record, plugin, "", Posting(event=event, brief=brief, open=open, key=key))
        return f"{plugin}.{event} raised"


class Settle(Command):
    name = "settle"

    def run(self, context: Context, plugins, plugin: str, key: str, how: str = "fixed"):
        settled = Agents(plugins.record, actor=SYSTEM).settle_cards(plugin, key, how)
        return f"{settled} marks of {plugin} settled as {how}"


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
