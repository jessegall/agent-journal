import re
from argparse import Namespace
from datetime import datetime, timezone
from pathlib import Path

from journal.console.command import Command
from journal.console.where import Where
from journal.engine.cards import Cards
from journal.engine.nudger import Nudger
from journal.features.shell.chain import Chain
from journal.features.shell.doing import Doing
from journal.features.shell.writes import Writes
from journal.models.entry import Entry
from journal.repositories.agents import Agents
from journal.models.edit import Edit
from journal.repositories.edits import Edits
from journal.repositories.entries import Entries
from journal.repositories.messages import Messages
from journal.repositories.scope import Scope
from journal.repositories.settings import Settings
from journal.supervisor_link import SupervisorLink

TAIL = 2000
RUNNING, RAN, MOVED, ENDED = "running", "ran", "background", "ended"
WORDS_IN = re.compile(r"[A-Za-z]{3,}")
"""A word of three letters or more: a line holding one says something."""
"""The entries a chain leaves: each part as it starts and as it ends, the move to the background, and the end of a moved chain."""


class ShellCommand(Command):
    """What the runner script asks of the journal: the parts of a line, the seconds a command may run in the foreground, and the record of each part, a move to the background and its end."""

    noun = "shell"

    def __init__(self, entries: Entries, messages: Messages, settings: Settings, agents: Agents, cards: Cards, nudger: Nudger, supervisor: SupervisorLink, scope: Scope, edits: Edits) -> None:
        self.entries, self.messages, self.settings, self.agents = entries, messages, settings, agents
        self.edits = edits
        self.cards, self.nudger, self.supervisor, self.scope = cards, nudger, supervisor, scope

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
        waiting = bool(self.messages.unread())
        from journal.features.shell.feature import Shell
        print(int(self.settings.option(Shell.WHILE_WAITING if waiting else Shell.FOREGROUND)))
        return 0

    def cap(self, args: Namespace, where: Where) -> int:
        from journal.features.shell.feature import Shell
        print(int(self.settings.option(Shell.SHOWN)))
        return 0

    def started(self, args: Namespace, where: Where) -> int:
        self.record(where, RUNNING, {"chain": args.chain, "part": args.part, "doing": Doing.of(args.part)})
        return 0

    def ran(self, args: Namespace, where: Where) -> int:
        changed = [{"added": int(a) if a.isdigit() else 0, "removed": int(r) if r.isdigit() else 0, "path": path} for a, r, path in (line.split("\t", 2) for line in args.changed.splitlines() if line.count("\t") == 2)]
        self.record(where, RAN, {"chain": args.chain, "part": args.part, "doing": Doing.of(args.part), "status": args.status, "seconds": args.seconds, "output": args.output[-TAIL:], "changed": changed})
        now = datetime.now(timezone.utc).timestamp()
        for change in changed:
            self.edits.record(Edit(session=where.session, path=change["path"], at=now, added=change["added"], removed=change["removed"], command=args.part), where.actor)
        return 0

    def moved(self, args: Namespace, where: Where) -> int:
        from journal.features.shell.feature import Shell
        self.record(where, MOVED, {"chain": args.chain, "part": args.part, "file": args.file})
        self.cards.show(self.scope.id, where.session, f"Moved to the background: {Doing.of(args.part)}", "terminal", "", args.part)
        print(Shell.MOVED.about(part=args.part, file=args.file).rendered())
        return 0

    def ended(self, args: Namespace, where: Where) -> int:
        from journal.features.shell.feature import Shell
        self.record(where, ENDED, {"chain": args.chain, "status": args.status, "file": args.file, "last": args.last})
        part = self.moved_part(args.chain)
        outcome = "finished" if args.status == 0 else f"failed with code {args.status}"
        said = self.said_last(args.last)
        self.cards.show(self.scope.id, where.session, f"{outcome.capitalize()} in the background: {Doing.of(part)}", "terminal", "good" if args.status == 0 else "bad", "\n".join(line for line in (part, said) if line))
        live = self.agents.live()
        if live:
            line = self.nudger.say(live, Shell.ENDED.about(part=part, outcome=outcome, last=args.last[-300:], file=args.file))
            if line:
                self.supervisor.type(self.scope.id, line)
        return 0

    def moved_part(self, chain: str) -> str:
        """The command a chain was running when it moved to the background."""
        return next((e.data["part"] for e in self.entries.of_kind(MOVED, 200) if e.data.get("chain") == chain), "")

    @staticmethod
    def said_last(last: str) -> str:
        """The last line of output when it says something in words, not a row of progress dots or a percentage."""
        line = next((l.strip() for l in reversed(last.splitlines()) if l.strip()), "")
        return line if WORDS_IN.search(line) else ""

    def record(self, where: Where, kind: str, data: dict) -> None:
        self.entries.save(Entry(environment_id=self.scope.id, kind=kind, actor=where.actor, data={**data, "session": where.session, "at": datetime.now(timezone.utc).timestamp()}), where.actor)
