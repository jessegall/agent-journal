from argparse import Namespace
from datetime import datetime, timezone
from pathlib import Path

from journal.console.command import Command
from journal.console.where import Where
from journal.engine.cards import Cards
from journal.engine.nudger import Nudger
from journal.features.shell.chain import Chain
from journal.features.shell.doing import Doing
from journal.features.shell.listeners.read_narrowly import SHOWN
from journal.features.shell.writes import Writes
from journal.models.entry import Entry
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.repositories.messages import Messages
from journal.repositories.settings import PROJECT, Settings
from journal.supervisor_link import SupervisorLink

FOREGROUND = "shell.foreground"
WHILE_WAITING = "shell.foreground_while_waiting"
TAIL = 2000
RUNNING, RAN, MOVED, ENDED = "running", "ran", "background", "ended"
"""The entries a chain leaves: each part as it starts and as it ends, the move to the background, and the end of a moved chain."""


class ShellCommand(Command):
    """What the runner script asks of the journal: the parts of a line, the seconds a command may run in the foreground, and the record of each part, a move to the background and its end."""

    noun = "shell"

    def __init__(self, entries: Entries, environments: Environments, messages: Messages, settings: Settings, agents: Agents, cards: Cards, nudger: Nudger, supervisor: SupervisorLink) -> None:
        self.entries, self.environments, self.messages, self.settings, self.agents = entries, environments, messages, settings, agents
        self.cards, self.nudger, self.supervisor = cards, nudger, supervisor

    def arguments(self, verbs) -> None:
        split = self.verb(verbs, "split", "the commands a line chains, each written to its own file in the folder; one line per part: R or S for the agent's own or the shell's wrapping, ; or & for how it follows, & or ; for what follows, w or - for whether it writes")
        split.add_argument("line")
        split.add_argument("--into", required=True)
        self.verb(verbs, "limit", "the seconds a command may run in the foreground now")
        self.verb(verbs, "cap", "the lines of a part's output shown at each end; the middle is cut and left in the part's file")
        started = self.verb(verbs, "started", "a part of a chain has started")
        started.add_argument("part")
        started.add_argument("--chain", required=True)
        ran = self.verb(verbs, "ran", "a part of a chain has ended")
        ran.add_argument("part")
        ran.add_argument("--chain", required=True)
        ran.add_argument("--status", type=int, required=True)
        ran.add_argument("--seconds", type=float, default=0.0)
        ran.add_argument("--output", default="")
        ran.add_argument("--changed", default="", help="the files the part changed, one a line: added, removed, path, tab-separated")
        moved = self.verb(verbs, "moved", "a chain went to the background")
        moved.add_argument("chain")
        moved.add_argument("part")
        moved.add_argument("--file", required=True)
        ended = self.verb(verbs, "ended", "a chain in the background has ended")
        ended.add_argument("chain")
        ended.add_argument("--status", type=int, required=True)
        ended.add_argument("--file", required=True)
        ended.add_argument("--last", default="")

    def split(self, args: Namespace, where: Where) -> int:
        """A part may span lines, so each goes to a file of its own; the printed index says which are the agent's."""
        folder = Path(args.into)
        for i, part in enumerate(Chain.parts(args.line)):
            (folder / f"{i}.part").write_text(part.text)
            print(part.kind() + ("w" if part.recorded and Writes.part(part.text) else "-"))
        return 0

    def limit(self, args: Namespace, where: Where) -> int:
        """Ten seconds while a message of the user's waits, thirty otherwise, as the settings say."""
        environment = self.environments.named(where.environment).id
        waiting = bool(self.messages.unread(environment))
        print(int(self.settings.get(PROJECT, WHILE_WAITING if waiting else FOREGROUND, 10 if waiting else 30)))
        return 0

    def cap(self, args: Namespace, where: Where) -> int:
        print(int(self.settings.get(PROJECT, SHOWN, 200)))
        return 0

    def started(self, args: Namespace, where: Where) -> int:
        self.record(where, RUNNING, {"chain": args.chain, "part": args.part, "doing": Doing.of(args.part)})
        return 0

    def ran(self, args: Namespace, where: Where) -> int:
        changed = [{"added": int(a) if a.isdigit() else 0, "removed": int(r) if r.isdigit() else 0, "path": path} for a, r, path in (line.split("\t", 2) for line in args.changed.splitlines() if line.count("\t") == 2)]
        self.record(where, RAN, {"chain": args.chain, "part": args.part, "doing": Doing.of(args.part), "status": args.status, "seconds": args.seconds, "output": args.output[-TAIL:], "changed": changed})
        return 0

    def moved(self, args: Namespace, where: Where) -> int:
        from journal.features.shell.feature import Shell
        environment = self.environments.named(where.environment).id
        self.record(where, MOVED, {"chain": args.chain, "part": args.part, "file": args.file})
        self.cards.show(environment, where.session, f"Moved to the background: {Doing.of(args.part)}", "terminal", "", args.part, key=f"chain:{args.chain}")
        print(Shell.MOVED.about(part=args.part, file=args.file).rendered())
        return 0

    def ended(self, args: Namespace, where: Where) -> int:
        from journal.features.shell.feature import Shell
        environment = self.environments.named(where.environment).id
        self.record(where, ENDED, {"chain": args.chain, "status": args.status, "file": args.file, "last": args.last})
        outcome = "ended" if args.status == 0 else f"failed with code {args.status}"
        self.cards.show(environment, where.session, f"Background command {outcome}", "terminal", "good" if args.status == 0 else "bad", args.last, key=f"chain:{args.chain}")
        live = self.agents.live(environment)
        if live:
            line = self.nudger.say(live, Shell.ENDED.about(outcome=outcome, last=args.last[-300:], file=args.file))
            if line:
                self.supervisor.type(environment, line)
        return 0

    def record(self, where: Where, kind: str, data: dict) -> None:
        environment = self.environments.named(where.environment).id
        self.entries.save(Entry(environment_id=environment, kind=kind, actor=where.actor, data={**data, "session": where.session, "at": datetime.now(timezone.utc).timestamp()}), where.actor)
