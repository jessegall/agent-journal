import re
import shutil
from dataclasses import asdict
from datetime import datetime, timezone
from pathlib import Path

from journal.hooks.command_events import CommandEvents
from journal.features.shell.support.changed_file import ChangedFile
from journal.features.shell.support.activity_label import ActivityLabel
from journal.features.shell.support.output_files import OutputFiles
from journal.features.shell.support.output_log import OutputLog
from journal.models.entry import Entry
from journal.repositories.agents import Agents
from journal.models.agent import Agent
from journal.repositories.command_outputs import CommandOutputs
from journal.repositories.entries import Entries
from journal.repositories.setting_rows import SettingRows
from journal.chat.cards import Cards
from journal.support.card_kind import CardKind
from journal.repositories.scope import Scope
from journal.support.caller import Caller
from journal.engine.states_catalogue import StatesCatalogue
from journal.engine.states.wait import Wait
from journal.models.command_output import CommandOutput

TAIL_CHARACTERS = 2000
PIPED = re.compile(r"(?<!\|)\|(?!\|)")
PART_START, PART_END, MOVED, ENDED = "running", "ran", "background", "ended"
LETTER_RUN_PATTERN = re.compile(r"[A-Za-z]{3,}")


class ShellRecord:
    """What the runner records as a chain runs: each of the agent's own parts as it starts and ends with its status, time, output tail and the files it changed (the edits feature keeps the changed lines from the tool's end), the move to the background with its card and event, the end of a moved chain, and whether an ended output is kept under its number or forgotten."""

    def __init__(self, entries: Entries, log: OutputLog, outputs: CommandOutputs, cards: Cards, events: CommandEvents, agents: Agents, settings: SettingRows, scope: Scope, states: StatesCatalogue) -> None:
        self.entries, self.log, self.outputs = entries, log, outputs
        self.cards, self.events, self.agents, self.settings, self.scope, self.states = cards, events, agents, settings, scope, states

    def start(self, chain: str, command: str, folder: Path, caller: Caller) -> int:
        return self.log.start(chain, command, folder, caller.session, caller.actor).id

    def started(self, chain: str, part: str, caller: Caller) -> None:
        self.record(caller, PART_START, {"chain": chain, "part": part, "doing": ActivityLabel.build(part)})

    def finish_part(self, chain: str, part: str, status: int, seconds: float, output: str, changed: list[ChangedFile], caller: Caller) -> None:
        self.record(caller, PART_END, {"chain": chain, "part": part, "doing": ActivityLabel.build(part), "status": status, "seconds": seconds, "output": output[-TAIL_CHARACTERS:], "changed": [asdict(c) for c in changed]})

    def moved(self, chain: str, part: str, folder: Path, caller: Caller) -> int:
        self.record(caller, MOVED, {"chain": chain, "part": part, "doing": ActivityLabel.build(part), "file": str(folder)})
        output = self.outputs.save(self.outputs.chain_output(chain).backgrounded(), caller.actor)
        if caller.session:
            self.events.moved(output, caller.session)
        self.cards.show(self.scope.id, caller.session, f"Moved to the background: {ActivityLabel.build(part)}", "terminal", key=f"background:{chain}", command=part, shows=CardKind.COMMANDS)
        return output.id

    def ended(self, chain: str, status: int, folder: Path, last: str, caller: Caller) -> None:
        self.record(caller, ENDED, {"chain": chain, "status": status, "file": str(folder), "last": last})
        part = next((e.data["part"] for e in self.entries.kind_entries(MOVED, 200) if e.data.get("chain") == chain), "")
        outcome = OutputFiles.ended(status)
        self.cards.show(self.scope.id, caller.session, f"{outcome.capitalize()} in the background: {ActivityLabel.build(part)}", "terminal", "good" if status == 0 else "bad", self.last_sentence(last), key=f"background:{chain}", command=part, shows=CardKind.COMMANDS)
        agent = self.agents.current()
        if agent:
            output, moment = self.outputs.chain_output(chain), datetime.now(timezone.utc).timestamp()
            finish = output.wait_end(status, moment) if self.wait_covers(output, agent) else output.ended_with(status, moment)
            self.events.ended(self.outputs.save(finish, caller.actor), agent)

    def wait_covers(self, output: CommandOutput, agent: Agent) -> bool:
        top = self.states.stack(agent).top() if agent.session == output.session else None
        return isinstance(top, Wait) and f"{output.table()}:{output.id}" in top.wait_description()[1].split(",")

    def is_stored(self, chain: str, line: str, size: int, cut: bool) -> bool:
        from journal.features.shell.feature import Shell
        return size >= int(self.settings.option(Shell.SHORT)) or bool(PIPED.search(line)) or cut

    def delete_output(self, chain: str, caller: Caller) -> None:
        output = self.outputs.chain_output(chain)
        self.outputs.delete(output, caller.actor)
        shutil.rmtree(output.folder, ignore_errors=True)

    @staticmethod
    def last_sentence(last: str) -> str:
        line = next((l.strip() for l in reversed(last.splitlines()) if l.strip()), "")
        return line if LETTER_RUN_PATTERN.search(line) else ""

    def record(self, caller: Caller, kind: str, data: dict) -> None:
        self.entries.save(Entry(environment_id=self.scope.id, kind=kind, actor=caller.actor, data={**data, "session": caller.session, "time": datetime.now(timezone.utc).timestamp()}), caller.actor)
