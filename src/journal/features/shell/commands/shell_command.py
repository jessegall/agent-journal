import re
from argparse import Namespace
from datetime import datetime, timezone
from pathlib import Path

from journal.console.command import Command
from journal.support.where import Where
from journal.support.cards import Cards
from journal.engine.nudger import Nudger
from journal.support.chain import Chain
from journal.features.shell.support.doing import Doing
from journal.features.shell.support.output_files import OutputFiles
from journal.features.shell.support.output_log import OutputLog
from journal.support.writes import Writes
from journal.models.entry import Entry
from journal.repositories.agents import Agents
from journal.repositories.command_outputs import CommandOutputs
from journal.models.edit import Edit
from journal.repositories.edits import Edits
from journal.repositories.entries import Entries
from journal.repositories.messages import Messages
from journal.support.scope import Scope
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

    def __init__(self, entries: Entries, messages: Messages, settings: Settings, agents: Agents, cards: Cards, nudger: Nudger, supervisor: SupervisorLink, scope: Scope, edits: Edits, log: OutputLog, outputs: CommandOutputs) -> None:
        self.entries, self.messages, self.settings, self.agents = entries, messages, settings, agents
        self.edits, self.log, self.outputs = edits, log, outputs
        self.cards, self.nudger, self.supervisor, self.scope = cards, nudger, supervisor, scope

    def arguments(self, verbs) -> None:
        split = self.verb(verbs, "split", "the commands a line chains, each written to its own file in the folder; one line per part: R or S for the agent's own or the shell's wrapping, ; or & for how it follows, & or ; for what follows, w or - for whether it writes")
        split.add_argument("line")
        split.add_argument("--into", required=True)
        limit = self.verb(verbs, "limit", "the seconds a command may run in the foreground now; none, 0, for a line of journal commands alone, whose answer must reach the agent")
        limit.add_argument("--line", default="")
        cap = self.verb(verbs, "cap", "how a part's output is shown, and how many characters of it: whole for a line of journal commands, its ends for a command that reads, and for any other whole up to the number or else only a line naming the output to read")
        cap.add_argument("--line", default="")
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
        cuts = [cut for part in Chain.parts(args.line) if (cut := part.cut())]
        parts = [part.uncut() for part in Chain.parts(args.line)]
        if cuts:
            (folder / "dropped").write_text(f"[journal] {', '.join(cuts)} dropped: the whole output is kept, so read it by its number instead of cutting it\n")
        for i, part in enumerate(parts):
            (folder / f"{i}.part").write_text(part.text)
            print(part.kind() + ("w" if part.recorded and Writes.part(part.text) else "-"))
        if Chain.is_journal_line(args.line):
            return 0
        output = self.log.began(folder.name, "\n".join(part.text for part in parts if part.recorded), folder, where.session, where.actor)
        (folder / "number").write_text(str(output.id))
        return 0

    def limit(self, args: Namespace, where: Where) -> int:
        """Ten seconds while a message of the user's waits, thirty otherwise, as the settings say; a line of journal commands alone is never moved."""
        from journal.features.shell.feature import Shell
        if Chain.is_journal_line(args.line):
            print(0)
            return 0
        waiting = bool(self.messages.unread())
        print(int(self.settings.option(Shell.WHILE_WAITING if waiting else Shell.FOREGROUND)))
        return 0

    def cap(self, args: Namespace, where: Where) -> int:
        from journal.features.shell.feature import Shell
        if Chain.is_journal_line(args.line):
            print("whole 0")
            return 0
        if Chain.is_read_line(args.line):
            print(f"ends {int(self.settings.option(Shell.READ_SHOWN))}")
            return 0
        print(f"hint {int(self.settings.option(Shell.COMMAND_SHOWN))}")
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
        output = self.outputs.save(self.outputs.of_chain(args.chain).moved_out(), where.actor)
        self.cards.show(self.scope.id, where.session, f"Moved to the background: {Doing.of(args.part)}", "terminal", key=f"background:{args.chain}", command=args.part)
        print(Shell.MOVED.about(n=output.id, file=args.file).rendered())
        return 0

    def ended(self, args: Namespace, where: Where) -> int:
        from journal.features.shell.feature import Shell
        self.record(where, ENDED, {"chain": args.chain, "status": args.status, "file": args.file, "last": args.last})
        part = self.moved_part(args.chain)
        outcome = OutputFiles.ended(args.status)
        said = self.said_last(args.last)
        self.cards.show(self.scope.id, where.session, f"{outcome.capitalize()} in the background: {Doing.of(part)}", "terminal", "good" if args.status == 0 else "bad", said, key=f"background:{args.chain}", command=part)
        live = self.agents.live()
        if live:
            output = self.outputs.save(self.outputs.of_chain(args.chain).ended_with(args.status), where.actor)
            line = self.nudger.say(live, Shell.ENDED.about(n=output.id, outcome=outcome, file=args.file))
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
