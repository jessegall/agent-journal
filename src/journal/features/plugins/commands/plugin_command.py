from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.features.plugins.installing import Installing
from journal.repositories.plugins import Plugins


class PluginCommand(Command):
    noun = "plugin"

    def __init__(self, plugins: Plugins, installing: Installing) -> None:
        self.plugins, self.installing = plugins, installing

    def arguments(self, verbs) -> None:
        self.verb(verbs, "list", "the plugins installed here, each on or off and how it last failed")
        install = self.verb(verbs, "install", "show all a plugin from a folder or a git address would run; with --yes, install it")
        install.add_argument("source")
        install.add_argument("--yes", action="store_true", help="install it after the preview")

    def list(self, args: Namespace, where: Where) -> int:
        for p in self.plugins.all():
            print(f"{p.name:<20} {'on' if p.enabled else 'off':<4} {p.manifest.get('version', '')}" + (f"  last fault: {p.last_fault}" if p.last_fault else ""))
        return 0

    def install(self, args: Namespace, where: Where) -> int:
        print(self.installing.preview(args.source))
        if not args.yes:
            print(f"nothing installed yet: journal plugin install {args.source} --yes")
            return 0
        plugin = self.installing.install(args.source, where.actor)
        print(f"installed {plugin.name}, on")
        return 0
