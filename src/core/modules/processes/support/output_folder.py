import codecs
import shutil
import os
from collections.abc import Iterator
from pathlib import Path
from core.base.journal_home import JournalHome
from core.base.timestamp import Timestamp
from core.modules.processes.support.colour_codes import ColourCodes

FOLDER_NAME = "processes"
LINE_FILE = "line"
PARTS_FILE = "parts"
PID_FILE = "pid"
END_FILE = "end"
FIRST_OUTPUT_FILE = "1.out"
HEARTBEAT_FILE = "heartbeat"
SLOT_FILE = "slot"
READER_LINES_FILE = "reader.lines"
TAIL_BYTES = 8192
BLOCK_BYTES = 64 * 1024

COUNT_OUTPUT = "count.out"
COUNT_STATUS = "counted"

COUNT_LINES = 20

class OutputFolder:
    """The one class that knows .journal/processes/<number>/: the line, the parts, each part's <position>.out
    and <position>.status, the runner's pid, the end and the heartbeat, the time of the runner's last sign
    of life, which the runner writes and the module reads."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def relative(self, process_id: int) -> str:
        return f"{self.home.folder.name}/{FOLDER_NAME}/{process_id}"

    def write_start(self, process_id: int, line: str, part_texts: list[str]) -> None:
        folder = self.home.folder / FOLDER_NAME / str(process_id)
        folder.mkdir(parents=True, exist_ok=True)
        (folder / LINE_FILE).write_text(line)
        (folder / PARTS_FILE).write_text("\n".join(part_texts))

    def line(self, process_id: int) -> str:
        return self.text(process_id, LINE_FILE)

    def part_texts(self, process_id: int) -> list[str]:
        text = self.text(process_id, PARTS_FILE)
        return text.split("\n") if text else []

    def write_slot(self, process_id: int) -> None:
        folder = self.home.folder / FOLDER_NAME / str(process_id)
        folder.mkdir(parents=True, exist_ok=True)
        (folder / SLOT_FILE).touch()

    def has_slot(self, process_id: int) -> bool:
        return (self.home.folder / FOLDER_NAME / str(process_id) / SLOT_FILE).exists()

    def write_pid(self, process_id: int, pid: int) -> None:
        self.write_number(process_id, PID_FILE, pid)

    def pid(self, process_id: int) -> int | None:
        return self.number(process_id, PID_FILE)

    def write_status(self, process_id: int, position: int, exit_code: int) -> None:
        self.write_number(process_id, f"{position}.status", exit_code)

    def status(self, process_id: int, position: int) -> int | None:
        return self.number(process_id, f"{position}.status")

    def write_output(self, process_id: int, position: int, text: str) -> None:
        self.write(process_id, f"{position}.out", text)

    def output(self, process_id: int, position: int) -> str:
        return self.text(process_id, f"{position}.out")

    def write_end(self, process_id: int, exit_code: int) -> None:
        self.write_number(process_id, END_FILE, exit_code)

    def end(self, process_id: int) -> int | None:
        return self.number(process_id, END_FILE)

    def beat(self, process_id: int, timestamp: Timestamp) -> None:
        self.write(process_id, HEARTBEAT_FILE, timestamp.text)

    def tick_interval_seconds(self, agent_id: int, timestamp: Timestamp) -> float:
        path = self.home.folder / FOLDER_NAME / f"tick-{agent_id}"
        previous = path.read_text() if path.exists() else timestamp.text
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(timestamp.text)
        return Timestamp.parsed(previous).elapsed_seconds(timestamp)

    def heartbeat(self, process_id: int) -> Timestamp | None:
        text = self.text(process_id, HEARTBEAT_FILE).strip()
        return Timestamp.parsed(text) if text else None

    def total_bytes(self, process_id: int) -> int:
        return sum(path.stat().st_size for path in self.output_paths(process_id) if path.exists())

    def output_paths(self, process_id: int) -> list[Path]:
        return [self.home.folder / FOLDER_NAME / str(process_id) / f"{position}.out" for position in range(1, len(self.part_texts(process_id)) + 1)]

    def running_ids(self) -> tuple[int, ...]:
        folder = self.home.folder / FOLDER_NAME
        names = [path.name for path in folder.iterdir() if path.name.isdigit()] if folder.is_dir() else []
        return tuple(int(name) for name in names if self.is_running(int(name)))

    def is_running(self, process_id: int) -> bool:
        is_started = (self.home.folder / FOLDER_NAME / str(process_id) / FIRST_OUTPUT_FILE).exists()
        return is_started and self.end(process_id) is None and self.has_leader_process(process_id)

    def has_leader_process(self, process_id: int) -> bool:
        pid = self.pid(process_id)
        if pid is None:
            return False
        try:
            os.kill(pid, 0)
        except OSError:
            return False
        return True

    def bytes_after(self, process_id: int, offset: int) -> bytes:
        """The bytes of the parts' output, in order, from the offset on; only the part files that reach past it are opened."""
        passed, collected = 0, b""
        for path in self.output_paths(process_id):
            size = path.stat().st_size if path.exists() else 0
            if size and passed + size > offset:
                with path.open("rb") as handle:
                    handle.seek(max(0, offset - passed))
                    collected += handle.read()
            passed += size
        return collected

    def reader_bytes_after(self, process_id: int, position: int, offset: int) -> bytes:
        if not position:
            return self.bytes_after(process_id, offset)
        path = self.home.folder / FOLDER_NAME / str(process_id) / f"{position}.out"
        if not path.exists():
            return b""
        with path.open("rb") as handle:
            handle.seek(offset)
            return handle.read()

    def reader_text(self, process_id: int, position: int) -> str:
        return ColourCodes.removed(self.output(process_id, position)) if position else self.all_output(process_id)

    def last_text(self, process_id: int) -> str:
        return "\n".join(self.last_lines(process_id, COUNT_LINES))

    def last_lines(self, process_id: int, count: int) -> list[str]:
        """The last lines, read from the end in windows that double until they hold one line more than asked,
        which drops a line cut by the window's start."""
        total = self.total_bytes(process_id)
        window = TAIL_BYTES
        while True:
            lines = ColourCodes.removed(self.bytes_after(process_id, max(0, total - window)).decode(errors="replace")).splitlines()
            if window >= total or len(lines) > count:
                return lines[-count:]
            window *= 2

    def numbered_lines(self, process_id: int, first: int, last: int) -> list[tuple[int, str]]:
        """The lines numbered first to last, counted from 1; the parts are read in chunks up to the last line wanted."""
        selected: list[tuple[int, str]] = []
        for number, line in enumerate(self.streamed_lines(process_id), 1):
            if number >= first:
                selected.append((number, line))
            if number >= last:
                break
        return selected

    def streamed_lines(self, process_id: int) -> Iterator[str]:
        decoder = codecs.getincrementaldecoder("utf-8")(errors="replace")
        pending = ""
        for path in self.output_paths(process_id):
            if not path.exists():
                continue
            with path.open("rb") as handle:
                while block := handle.read(BLOCK_BYTES):
                    complete, pending = self.split_complete(pending + decoder.decode(block))
                    yield from (ColourCodes.removed(line) for line in complete)
        if pending:
            yield ColourCodes.removed(pending)

    @staticmethod
    def split_complete(text: str) -> tuple[list[str], str]:
        """The lines of the text that end in a line break, and what follows the last one; a last piece that has no
        break, or ends in a carriage return that a line feed may follow, waits for more text."""
        segments = text.splitlines(keepends=True)
        incomplete = segments.pop() if segments and (segments[-1].splitlines()[0] == segments[-1] or segments[-1].endswith("\r")) else ""
        return [segment.splitlines()[0] for segment in segments], incomplete

    def reader_lines(self, process_id: int) -> list[str]:
        return self.text(process_id, READER_LINES_FILE).splitlines()

    def append_reader_lines(self, process_id: int, lines: list[str]) -> None:
        if lines:
            self.write(process_id, READER_LINES_FILE, "".join(f"{line}\n" for line in [*self.reader_lines(process_id), *lines]))

    def replace_reader_lines(self, process_id: int, lines: list[str]) -> None:
        self.write(process_id, READER_LINES_FILE, "".join(f"{line}\n" for line in lines))

    def all_output(self, process_id: int) -> str:
        return ColourCodes.removed("".join(self.output(process_id, position) for position in range(1, len(self.part_texts(process_id)) + 1)))

    def sizes(self, process_id: int) -> tuple[int, int]:
        """The bytes and the lines of all the parts, counted in chunks; a part without a last line feed still has
        its last line."""
        size = lines = 0
        for path in self.output_paths(process_id):
            if not path.exists():
                continue
            last = b""
            with path.open("rb") as handle:
                while block := handle.read(BLOCK_BYTES):
                    size, lines, last = size + len(block), lines + block.count(b"\n"), block[-1:]
            lines += 1 if last and last != b"\n" else 0
        return size, lines

    def remove(self, process_id: int) -> None:
        shutil.rmtree(self.home.folder / FOLDER_NAME / str(process_id), ignore_errors=True)

    def write_number(self, process_id: int, name: str, number: int) -> None:
        self.write(process_id, name, f"{number}")

    def write(self, process_id: int, name: str, text: str) -> None:
        folder = self.home.folder / FOLDER_NAME / str(process_id)
        folder.mkdir(parents=True, exist_ok=True)
        (folder / name).write_text(text)

    def text(self, process_id: int, name: str) -> str:
        path = self.home.folder / FOLDER_NAME / str(process_id) / name
        return path.read_text(errors="replace") if path.exists() else ""

    def number(self, process_id: int, name: str) -> int | None:
        text = self.text(process_id, name).strip()
        return int(text) if text.lstrip("-").isdigit() else None

    def count_text(self, process_id: int) -> str:
        return self.text(process_id, COUNT_OUTPUT)

    def count_status(self, process_id: int) -> int | None:
        return self.number(process_id, COUNT_STATUS)

    def write_count(self, process_id: int, text: str, status: int) -> None:
        self.write(process_id, COUNT_OUTPUT, text)
        self.write_number(process_id, COUNT_STATUS, status)
