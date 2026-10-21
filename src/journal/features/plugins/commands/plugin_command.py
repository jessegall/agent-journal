from argparse import Namespace

from journal.console.command import Command
from journal.support.caller import Caller
from journal.support.cards import Cards
from journal.features.plugins.support.plugin_preview import PluginPreview
from journal.support.plugin_installing import PluginInstalling
from journal.features.plugins.support.plugin_settings import PluginSettings
from journal.repositories.plugins import Plugins
from journal.support.scope import Scope
from journal.support.card_kind import CardKind

STEP_DESCRIPTIONS = {"needs": "needs", "setup": "runs at install", "installed": "runs at install, its answer filling the settings", "program": "runs", "service": "runs the service", "hears": "hears", "holds": "holds", "skill": "brings the skill"}


class PluginCommand(Command):
    noun = "plugin"

    def __init__(self, plugins: Plugins, installing: PluginInstalling, cards: Cards, scope: Scope, settings: PluginSettings) -> None:
        self.plugins, self.installing, self.cards, self.scope, self.schemas = plugins, installing, cards, scope, settings

    def arguments(self, verbs) -> None:
        self.verb(verbs, "list", "the plugins installed here, each on or off and how it last failed")
        install = self.verb(verbs, "install", "show all a plugin from a folder or a git address would run; with --yes, install it")
        install.add_argument("source")
        install.add_argument("--yes", action="store_true", help="install it after the preview")
        propose = self.verb(verbs, "propose", "show the user a card proposing a plugin, with all it would run, for them to install")
        propose.add_argument("source")
        propose.add_argument("--why", default="", help="what it is for")
        upgrade = self.verb(verbs, "upgrade", "show what changes in what a plugin runs, hears and holds; with --yes, upgrade it")
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
        remove = self.verb(verbs, "remove", "take a plugin out; its data folder stays unless --purge")
        remove.add_argument("name")
        remove.add_argument("--purge", action="store_true", help="delete its data folder too")

    def list(self, args: Namespace, caller: Caller) -> int:
        for p in self.plugins.all():
            print(f"{p.name:<20} {'on' if p.enabled else 'off':<4} {p.manifest.version}" + (f"  last fault: {p.last_fault}" if p.last_fault else ""))
        return 0

    def install(self, args: Namespace, caller: Caller) -> int:
        print(self.said(self.installing.preview(args.source)))
        if not args.yes:
            print(f"nothing installed yet: journal plugin install {args.source} --yes")
            return 0
        plugin = self.installing.install(args.source, caller.environment, caller.actor)
        print(f"installed {plugin.name}, on")
        return 0

    def propose(self, args: Namespace, caller: Caller) -> int:
        preview = self.installing.preview(args.source)
        self.cards.show(self.scope.id, "", f"The agent proposes the plugin {preview.name}" + (f": {args.why}" if args.why else ""), "plug", detail=f"{self.said(preview)}\n\nTo install it: journal plugin install {args.source} --yes", actor=caller.actor, shows=CardKind.PLUGINS)
        print(f"proposed {preview.name}: the user installs it if they want it")
        return 0

    def upgrade(self, args: Namespace, caller: Caller) -> int:
        preview = self.installing.upgrade_preview(args.name, args.ref)
        print("\n".join([f"{args.name} from {preview.was[:12] or preview.source} to {preview.commit[:12] or 'the folder as it is now'}", *(preview.changes or ["nothing it runs, hears or holds changes"])]))
        if preview.code and caller.session:
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
            print(f"{setting.key:<16} {setting.kind:<7} {shown}  {setting.title}" + (f": {setting.help}" if setting.help else ""))
        return 0

    @staticmethod
    def said(preview: PluginPreview) -> str:
        head = [f"{preview.name} {preview.version}" + (f": {preview.title}" if preview.title != preview.name else ""), f"from {preview.source}" + (f" at {preview.commit[:12]}" if preview.commit else " (linked: read where it lies)")]
        return "\n".join(head + [f"{STEP_DESCRIPTIONS[r.kind]} {r.label}: {r.command}".rstrip(": ") for r in preview.rows])
