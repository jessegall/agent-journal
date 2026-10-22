from datetime import datetime, timezone

from journal.features.shell.support.shell_record import PART_END
from journal.http.agents.terminal_line import TerminalLine
from journal.models.agent import Agent
from journal.models.entry import Entry
from journal.repositories.entries import Entries
from journal.support.command_part import CommandPart

LINES_SHOWN = 200
ENTRIES_READ = 400
PART_STEP = 0.001
CURSOR_MARGIN_SECONDS = 1.0


class TerminalLines:
    """The agent's Terminal pane: each part of each shell call it finished, as the call was recorded, with the output the shell record kept of that part when it ran through the journal."""

    def __init__(self, entries: Entries) -> None:
        self.entries = entries

    def lines(self, agent: Agent, cursor: float) -> list[TerminalLine]:
        earliest = datetime.fromtimestamp(max(cursor - CURSOR_MARGIN_SECONDS, 0.0), timezone.utc)
        ended_ids = {e.data.get("tool_use_id") for e in self.entries.newer_tool_ends(agent.session, earliest, ENTRIES_READ)}
        shell_calls = [e for e in reversed(self.entries.newer_shell_starts(agent.session, earliest, ENTRIES_READ)) if e.recorded_call().command and e.data.get("tool_use_id") in ended_ids]
        part_ends = sorted((e for e in self.entries.newer_kind_entries(PART_END, earliest, ENTRIES_READ) if e.actor and e.actor.id == agent.session), key=lambda e: e.data["time"])
        all_lines = [line for call in shell_calls for line in self.call_lines(agent.row_id, call, part_ends)]
        return [line for line in all_lines if line["time"] > cursor][-LINES_SHOWN:]

    def call_lines(self, agent_id: int, call: Entry, part_ends: list[Entry]) -> list[TerminalLine]:
        start_time = call.creation_time.timestamp()
        parts = call.recorded_call().parts
        return [self.part_line(agent_id, start_time + i * PART_STEP, part, self.part_end(part.text, start_time, part_ends)) for i, part in enumerate(parts)]

    @staticmethod
    def part_end(text: str, start_time: float, part_ends: list[Entry]) -> Entry | None:
        match = next((e for e in part_ends if e.data["part"] == text and e.data["time"] >= start_time), None)
        if match:
            part_ends.remove(match)
        return match

    @staticmethod
    def part_line(agent_id: int, time: float, part: CommandPart, part_end: Entry | None) -> TerminalLine:
        record = part_end.data if part_end else {}
        return TerminalLine(agent_id=agent_id, time=time, tool="Journal" if part.is_journal else "Bash", command=part.text, output=record.get("output", ""),
                            seconds=record.get("seconds", 0.0), status=record.get("status", 0), stepped=False, level="everything")
