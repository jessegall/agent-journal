from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.engine.cards import Cards
from journal.features.plugins.installing import Installing
from journal.repositories.plugins import Plugins
from journal.repositories.scope import Scope


class PluginCommand(Command):
    noun = "plugin"

    def __init__(self, plugins: Plugins, installing: Installing, cards: Cards, scope: Scope) -> None:
        self.plugins, self.installing, self.cards, self.scope = plugins, installing, cards, scope

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
        upgrade.add_argument("--ref", default="", help="the commit or tag to upgrade to; its newest when left out")
        upgrade.add_argument("--yes", action="store_true", help="upgrade it after the preview")
        self.verb(verbs, "enable", "switch a plugin on, for the whole project").add_argument("name")
        self.verb(verbs, "disable", "switch a plugin off: it hears nothing until switched on").add_argument("name")
        remove = self.verb(verbs, "remove", "take a plugin out; its data folder stays unless --purge")
        remove.add_argument("name")
        remove.add_argument("--purge", action="store_true", help="delete its data folder too")

    def list(self, args: Namespace, where: Where) -> int:
        for p in self.plugins.all():
            print(f"{p.name:<20} {'on' if p.enabled else 'off':<4} {p.manifest.get('version', '')}" + (f"  last fault: {p.last_fault}" if p.last_fault else ""))
        return 0

    def install(self, args: Namespace, where: Where) -> int:
        print(self.installing.preview(args.source)[1])
        if not args.yes:
            print(f"nothing installed yet: journal plugin install {args.source} --yes")
            return 0
        plugin = self.installing.install(args.source, where.actor)
        print(f"installed {plugin.name}, on")
        return 0

    def propose(self, args: Namespace, where: Where) -> int:
        manifest, preview = self.installing.preview(args.source)
        self.cards.show(self.scope.id, "", f"The agent proposes the plugin {manifest.name}" + (f": {args.why}" if args.why else ""), "plug", detail=f"{preview}\n\nTo install it: journal plugin install {args.source} --yes", by=where.actor)
        print(f"proposed {manifest.name}: the user installs it if they want it")
        return 0

    def upgrade(self, args: Namespace, where: Where) -> int:
        print(self.installing.upgrade_preview(args.name, args.ref))
        if not args.yes:
            print(f"nothing upgraded yet: journal plugin upgrade {args.name}{' --ref ' + args.ref if args.ref else ''} --yes")
            return 0
        self.installing.upgrade(args.name, args.ref, where.actor)
        print(f"upgraded {args.name}")
        return 0

    def enable(self, args: Namespace, where: Where) -> int:
        self.installing.enable(args.name, where.actor)
        print(f"{args.name} on")
        return 0

    def disable(self, args: Namespace, where: Where) -> int:
        self.installing.disable(args.name, where.actor)
        print(f"{args.name} off")
        return 0

    def remove(self, args: Namespace, where: Where) -> int:
        if args.purge:
            self.installing.purge(args.name, where.actor)
            print(f"removed {args.name} and its data")
            return 0
        self.installing.remove(args.name, where.actor)
        print(f"removed {args.name}; its data folder stays in .journal/plugin-data/{args.name}")
        return 0
