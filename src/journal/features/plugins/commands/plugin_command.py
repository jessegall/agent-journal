from argparse import REMAINDER, Namespace

from journal.features.plugins.support.plugin_health import PluginHealth
from journal.support.rejection import Rejection
from journal.models.plugin import Plugin
from journal.console.command import Command
from journal.support.caller import Caller
from journal.events.announcer import Announcer
from journal.events.moments.plugin_proposed import PluginProposed
from journal.features.plugins.support.plugin_preview import PluginPreview
from journal.features.plugins.support.plugin_aliases import PluginAliases
from journal.features.plugins.support.plugin_installing import PluginInstalling
from journal.features.plugins.support.plugin_runs import PluginRuns
from journal.features.plugins.support.plugin_settings import PluginSettings
from journal.repositories.plugins import Plugins
from journal.repositories.scope import Scope

STEP_DESCRIPTIONS = {"needs": "needs", "setup": "runs at install", "installed": "runs at install, its answer filling the settings", "program": "runs", "service": "runs the service", "hears": "hears", "holds": "holds", "skill": "brings the skill", "alias": "brings the alias"}


class PluginCommand(Command):
    noun = "plugin"

    def __init__(self, plugins: Plugins, installing: PluginInstalling, announcer: Announcer, scope: Scope, settings: PluginSettings, aliases: PluginAliases, probes: PluginHealth, runs: PluginRuns) -> None:
        self.plugins, self.installing, self.announcer, self.scope, self.schemas, self.aliases, self.probes, self.runs = plugins, installing, announcer, scope, settings, aliases, probes, runs

    def arguments(self, verbs) -> None:
        self.verb(verbs, "list", "the plugins installed here, each on or off and how it last failed")
        self.verb(verbs, "health", "probe each plugin's service in this environment, or one plugin's, and say whether it answered within 200 ms and how fast").add_argument("name", nargs="?", default="")
        install = self.verb(verbs, "install", "show all a plugin from a folder or a git address would run; with --yes, install it")
        install.add_argument("source")
        install.add_argument("--yes", action="store_true", help="install it after the preview")
        propose = self.verb(verbs, "propose", "show the user a card proposing a plugin, with all it would run, for them to install")
        propose.add_argument("source")
        propose.add_argument("--why", default="", help="what it is for")
        upgrade = self.verb(verbs, "upgrade", "show what changes in what a plugin runs, hears and blocks; with --yes, upgrade it")
        upgrade.add_argument("name")
        upgrade.add_argument("--ref", help="the commit or tag to upgrade to; its newest when left out")
        upgrade.add_argument("--yes", action="store_true", help="upgrade it after the preview")
        self.verb(verbs, "enable", "switch a plugin on, for the whole project").add_argument("name")
        self.verb(verbs, "disable", "switch a plugin off: it hears nothing until switched on").add_argument("name")
        configure = self.verb(verbs, "configure", "set one of a plugin's settings, checked against its kind; a secret is filled on the Secrets page")
        configure.add_argument("name")
        configure.add_argument("key")
        configure.add_argument("value")
        self.verb(verbs, "settings", "a plugin's settings, what each is and how it is set").add_argument("name")
        queue = self.verb(verbs, "queue", "run a command for a plugin in a checkout, one run of its kind at a time, its output streamed and its exit code kept")
        queue.add_argument("name")
        queue.add_argument("--kind", required=True, help="what the run is, so runs of one kind wait for each other")
        queue.add_argument("--checkout", required=True, help="the folder it runs in")
        queue.add_argument("command", nargs=REMAINDER, help="after --: the command and its arguments")
        removal = self.verb(verbs, "remove", "take a plugin out; its data folder stays unless --purge")
        removal.add_argument("name")
        removal.add_argument("--purge", action="store_true", help="delete its data folder too")

    def health(self, args: Namespace, caller: Caller) -> int:
        health_plugins = self.plugins.enabled_plugins(args.name) if args.name else self.plugins.enabled()
        if args.name and not health_plugins:
            raise Rejection(f"no plugin named {args.name} is on")
        for plugin in health_plugins:
            print(f"{plugin.name}: {self.health_line(plugin, caller.environment)}")
        return 0

    def health_line(self, plugin: Plugin, environment: str) -> str:
        if not plugin.manifest.health.is_declared:
            return "declares no health check"
        probes = self.probes.probe(plugin, environment)
        if not probes:
            return "no service of it runs here"
        return "; ".join(f"{probe.service} answered in {round(probe.seconds * 1000)} ms" if probe.answered else f"{probe.service} not responding within 200 ms" for probe in probes)

    def list(self, args: Namespace, caller: Caller) -> int:
        for p in self.plugins.all():
            print(f"{p.name:<20} {'on' if p.enabled else 'off':<4} {p.manifest.version}" + (f"  last fault at {p.last_fault_at:%Y-%m-%d %H:%M}: {p.last_fault}" if p.last_fault_at else "") + (f"  waits for journal {p.wait_target}" if p.wait_target else "") + (f"  ignored manifest keys: {', '.join(p.manifest.ignored)}" if p.manifest.ignored else ""))
        return 0

    def install(self, args: Namespace, caller: Caller) -> int:
        print(self.description(self.installing.preview(args.source)))
        if not args.yes:
            print(f"nothing installed yet: journal plugin install {args.source} --yes")
            return 0
        plugin = self.installing.install(args.source, caller.environment, caller.actor)
        print(f"installed {plugin.name}, on")
        for name in sorted(self.aliases.skipped(plugin)):
            print(f"skipped its alias {name}: the name is taken")
        return 0

    def propose(self, args: Namespace, caller: Caller) -> int:
        preview = self.installing.preview(args.source)
        self.announcer.announce(PluginProposed(environment_id=self.scope.id, plugin=preview.name, explanation=args.why, detail=self.description(preview), command=f"journal plugin install {args.source} --yes", actor=caller.actor))
        print(f"proposed {preview.name}: the user installs it if they want it")
        return 0

    def upgrade(self, args: Namespace, caller: Caller) -> int:
        preview = self.installing.upgrade_preview(args.name, args.ref)
        print("\n".join([f"{args.name} from {preview.previous[:12] or preview.source} to {preview.commit[:12] or 'the folder as it is now'}", *(preview.changes or ["nothing it runs, hears or holds changes"])]))
        if preview.code and caller.session is not None:
            print("\nthe files it changes, the whole diff for the user on the Plugins page:\n" + "\n".join(preview.files_changed()))
        elif preview.code:
            print("\nthe code:\n" + "\n".join(preview.code))
        if not args.yes:
            print(f"nothing upgraded yet: journal plugin upgrade {args.name}{' --ref ' + args.ref if args.ref is not None else ''} --yes")
            return 0
        self.installing.upgrade(args.name, args.ref, caller.environment, caller.actor)
        print(f"upgraded {args.name}")
        return 0

    def enable(self, args: Namespace, caller: Caller) -> int:
        self.installing.enable(args.name, caller.actor)
        print(f"{args.name} on")
        return 0

    def disable(self, args: Namespace, caller: Caller) -> int:
        self.installing.disable(args.name, caller.actor)
        print(f"{args.name} off")
        return 0

    def queue(self, args: Namespace, caller: Caller) -> int:
        command = args.command[1:] if args.command[:1] == ["--"] else args.command
        return self.runs.run(self.plugins.lookup(args.name), caller.environment, args.kind, args.checkout, command)

    def remove(self, args: Namespace, caller: Caller) -> int:
        if args.purge:
            self.installing.purge(args.name, caller.actor)
            print(f"removed {args.name} and its data")
            return 0
        self.installing.remove(args.name, caller.actor)
        print(f"removed {args.name}; its data folder stays in .journal/plugin-data/{args.name}")
        return 0

    def configure(self, args: Namespace, caller: Caller) -> int:
        plugin = self.schemas.configure(args.name, args.key, args.value, caller.actor)
        print(f"{args.name} {args.key} = {plugin.settings[args.key]}")
        return 0

    def settings(self, args: Namespace, caller: Caller) -> int:
        plugin = self.plugins.lookup(args.name)
        for setting in self.schemas.schema(plugin):
            value = plugin.settings.get(setting.key)
            shown = f"secret {value['secret']}, filled on the Secrets page" if isinstance(value, dict) else value
            print(f"{setting.key:<16} {setting.setting_type:<7} {shown}  {setting.title}" + (f": {setting.help}" if setting.help else ""))
        return 0

    @staticmethod
    def description(preview: PluginPreview) -> str:
        head = [f"{preview.name} {preview.version}" + (f": {preview.title}" if preview.title != preview.name else ""), f"from {preview.source}" + (f" at {preview.commit[:12]}" if preview.commit else " (linked: read where it lies)")]
        return "\n".join(head + [f"{STEP_DESCRIPTIONS[r.item_type]} {r.label}: {r.command}".rstrip(": ") for r in preview.rows])
