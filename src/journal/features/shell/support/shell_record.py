import re
import shutil
from dataclasses import asdict
from datetime import datetime, timezone
from pathlib import Path

from journal.hooks.command_events import CommandEvents
from journal.features.shell.support.changed_file import ChangedFile
from journal.features.shell.support.doing import Doing
from journal.features.shell.support.output_files import OutputFiles
from journal.features.shell.support.output_log import OutputLog
from journal.models.entry import Entry
from journal.repositories.agents import Agents
from journal.repositories.command_outputs import CommandOutputs
from journal.repositories.entries import Entries
from journal.repositories.setting_rows import SettingRows
from journal.support.cards import Cards
from journal.support.chat_mark import ChatMark
from journal.support.scope import Scope
from journal.support.where import Where

TAIL = 2000
PIPED = re.compile(r"(?<!\|)\|(?!\|)")
RUNNING, RAN, MOVED, ENDED = "running", "ran", "background", "ended"
WORDS_IN = re.compile(r"[A-Za-z]{3,}")


class ShellRecord:
    """What the runner records as a chain runs: each of the agent's own parts as it starts and ends with its status, time, output tail and the files it changed (the edits feature keeps the changed lines from the tool's end), the move to the background with its card and event, the end of a moved chain, and whether an ended output is kept under its number or forgotten."""

    def __init__(self, entries: Entries, log: OutputLog, outputs: CommandOutputs, cards: Cards, events: CommandEvents, agents: Agents, settings: SettingRows, scope: Scope) -> None:
        self.entries, self.log, self.outputs = entries, log, outputs
        self.cards, self.events, self.agents, self.settings, self.scope = cards, events, agents, settings, scope

    def began(self, chain: str, command: str, folder: Path, where: Where) -> int:
        return self.log.began(chain, command, folder, where.session, where.actor).id

    def started(self, chain: str, part: str, where: Where) -> None:
        self.record(where, RUNNING, {"chain": chain, "part": part, "doing": Doing.of(part)})

    def ran(self, chain: str, part: str, status: int, seconds: float, output: str, changed: list[ChangedFile], where: Where) -> None:
        self.record(where, RAN, {"chain": chain, "part": part, "doing": Doing.of(part), "status": status, "seconds": seconds, "output": output[-TAIL:], "changed": [asdict(c) for c in changed]})

    def moved(self, chain: str, part: str, folder: Path, where: Where) -> int:
        self.record(where, MOVED, {"chain": chain, "part": part, "doing": Doing.of(part), "file": str(folder)})
        output = self.outputs.save(self.outputs.of_chain(chain).moved_out(), where.actor)
        if where.session:
            self.events.moved(output, where.session)
        self.cards.show(self.scope.id, where.session, f"Moved to the background: {Doing.of(part)}", "terminal", key=f"background:{chain}", command=part, shows=ChatMark.COMMANDS)
        return output.id

    def ended(self, chain: str, status: int, folder: Path, last: str, where: Where) -> None:
        self.record(where, ENDED, {"chain": chain, "status": status, "file": str(folder), "last": last})
        part = next((e.data["part"] for e in self.entries.of_kind(MOVED, 200) if e.data.get("chain") == chain), "")
        outcome = OutputFiles.ended(status)
        self.cards.show(self.scope.id, where.session, f"{outcome.capitalize()} in the background: {Doing.of(part)}", "terminal", "good" if status == 0 else "bad", self.last_sentence(last), key=f"background:{chain}", command=part, shows=ChatMark.COMMANDS)
        running = self.agents.live()
        if running:
            self.events.ended(self.outputs.save(self.outputs.of_chain(chain).ended_with(status, datetime.now(timezone.utc).timestamp()), where.actor), running)

    def is_kept(self, chain: str, line: str, size: int, cut: bool) -> bool:
        from journal.features.shell.feature import Shell
        return size >= int(self.settings.option(Shell.SHORT)) or bool(PIPED.search(line)) or cut

    def delete_output(self, chain: str, where: Where) -> None:
        output = self.outputs.of_chain(chain)
        self.outputs.delete(output, where.actor)
        shutil.rmtree(output.folder, ignore_errors=True)

    @staticmethod
    def last_sentence(last: str) -> str:
        line = next((l.strip() for l in reversed(last.splitlines()) if l.strip()), "")
        return line if WORDS_IN.search(line) else ""

    def record(self, where: Where, kind: str, data: dict) -> None:
        self.entries.save(Entry(environment_id=self.scope.id, kind=kind, actor=where.actor, data={**data, "session": where.session, "at": datetime.now(timezone.utc).timestamp()}), where.actor)
