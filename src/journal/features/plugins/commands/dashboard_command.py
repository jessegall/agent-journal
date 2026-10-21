from argparse import Namespace

from journal.console.command import Command
from journal.support.caller import Caller
from journal.models.dashboard_row import DashboardRow
from journal.support.rejection import Rejection
from journal.repositories.dashboard_rows import DashboardRows

TONES = ("", "good", "warn", "danger", "note", "muted")


class DashboardCommand(Command):
    """journal dashboard: a plugin keeps the lines of its own dashboard, one per key; only a plugin's program writes them, as itself."""

    noun = "dashboard"

    def __init__(self, rows: DashboardRows) -> None:
        self.rows = rows

    def arguments(self, verbs) -> None:
        placed = self.verb(verbs, "set", "write or rewrite one line of this plugin's dashboard, under its key")
        placed.add_argument("key")
        placed.add_argument("label")
        placed.add_argument("--badge", default="")
        placed.add_argument("--tone", default="", choices=TONES)
        placed.add_argument("--note", default="")
        placed.add_argument("--heading", default="", help="the heading it is shown under")
        self.verb(verbs, "unset", "take one line off this plugin's dashboard").add_argument("key")
        self.verb(verbs, "clear", "take every line off this plugin's dashboard")

    def set(self, args: Namespace, caller: Caller) -> int:
        plugin = self.plugin(caller)
        line = DashboardRow(plugin=plugin, key=args.key, label=args.label, badge=args.badge, tone=args.tone, note=args.note, section=args.heading)
        prior = self.rows.keyed(plugin, args.key)
        self.rows.save(prior.with_(**{f: getattr(line, f) for f in ("label", "badge", "tone", "note", "section")}) if prior else line, caller.actor)
        print(f"{args.key} set on {plugin}'s dashboard")
        return 0

    def unset(self, args: Namespace, caller: Caller) -> int:
        prior = self.rows.keyed(self.plugin(caller), args.key)
        if prior:
            self.rows.delete(prior, caller.actor)
        print(f"{args.key} {'taken off' if prior else 'was not on'} the dashboard")
        return 0

    def clear(self, args: Namespace, caller: Caller) -> int:
        plugin = self.plugin(caller)
        for line in self.rows.rows(plugin):
            self.rows.delete(line, caller.actor)
        print(f"{plugin}'s dashboard cleared")
        return 0

    @staticmethod
    def plugin(caller: Caller) -> str:
        if caller.plugin_name is None:
            raise Rejection("a dashboard's lines are written by its plugin's program, which the journal gives its name and token")
        return caller.plugin_name
