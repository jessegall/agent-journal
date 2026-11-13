from engine.file.file_access import FileAccess
import codecs
import shutil
import os
from collections.abc import Iterator
from pathlib import Path
from engine.journal.journal_home import JournalHome
from engine.time.timestamp import Timestamp
from core.modules.processes.support.colour_codes import ColourCodes
from core.modules.processes.support.output_page import NEWLINE, OutputPage

FOLDER_NAME = "processes"
END_POLL_SECONDS = 0.5
PAGE_BYTES = 1 << 20
READS_FILE = "reads"
LINE_FILE = "line"
PARTS_FILE = "parts"
PID_FILE = "pid"
END_FILE = "end"
FIRST_STARTED_FILE = "1.started"
HEARTBEAT_FILE = "heartbeat"
SLOT_FILE = "slot"
READER_LINES_FILE = "reader.lines"
CPU_FILE = "cpu"
TAIL_BYTES = 8192
BLOCK_BYTES = 64 * 1024

COUNT_OUTPUT = "count.out"
COUNT_STATUS = "counted"

COUNT_LINES = 20
MOVE_FILE = "move"



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
        FileAccess.shared().write(folder / LINE_FILE, line)
        FileAccess.shared().write(folder / PARTS_FILE, "\n".join(part_texts))

    def line(self, process_id: int) -> str:
        return self.text(process_id, LINE_FILE)

    def part_texts(self, process_id: int) -> list[str]:
        text = self.text(process_id, PARTS_FILE)
        return text.split("\n") if text else []

    def write_slot(self, process_id: int) -> None:
        folder = self.home.folder / FOLDER_NAME / str(process_id)
        folder.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().update_timestamp(folder / SLOT_FILE)

    def has_slot(self, process_id: int) -> bool:
        return (self.home.folder / FOLDER_NAME / str(process_id) / SLOT_FILE).exists()

    def ask_move(self, process_id: int) -> None:
        self.write(process_id, MOVE_FILE, "1")

    def has_move_request(self, process_id: int) -> bool:
        return (self.home.folder / FOLDER_NAME / str(process_id) / MOVE_FILE).exists()

    def write_pid(self, process_id: int, pid: int) -> None:
        self.write_number(process_id, PID_FILE, pid)

    def pid(self, process_id: int) -> int | None:
        return self.number(process_id, PID_FILE)

    def pid_path(self, process_id: int) -> Path:
        return self.home.folder / FOLDER_NAME / str(process_id) / PID_FILE

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
        FileAccess.shared().write(path, timestamp.text)
        return Timestamp.parsed(previous).elapsed_seconds(timestamp)

    def heartbeat(self, process_id: int) -> Timestamp | None:
        text = self.text(process_id, HEARTBEAT_FILE).strip()
        return Timestamp.parsed(text) if text else None

    def total_bytes(self, process_id: int) -> int:
        return sum(path.stat().st_size for path in self.output_paths(process_id) if path.exists())

    def part_bytes(self, process_id: int, position: int) -> int:
        path = self.home.folder / FOLDER_NAME / str(process_id) / f"{position}.out"
        return path.stat().st_size if path.exists() else 0

    def part_head(self, process_id: int, position: int, size: int) -> bytes:
        path = self.home.folder / FOLDER_NAME / str(process_id) / f"{position}.out"
        if not path.exists():
            return b""
        with path.open("rb") as handle:
            return handle.read(size)

    def run_silent_seconds(self, process_id: int, timestamp: Timestamp) -> int:
        return int(timestamp.value.timestamp() - max(path.stat().st_mtime for path in self.output_paths(process_id) if path.exists()))

    def silent_seconds(self, process_id: int, position: int, timestamp: Timestamp) -> int:
        path = self.home.folder / FOLDER_NAME / str(process_id) / f"{position}.out"
        return int(timestamp.value.timestamp() - path.stat().st_mtime)

    def output_paths(self, process_id: int) -> list[Path]:
        return [self.home.folder / FOLDER_NAME / str(process_id) / f"{position}.out" for position in range(1, len(self.part_texts(process_id)) + 1)]

    def running_ids(self) -> tuple[int, ...]:
        folder = self.home.folder / FOLDER_NAME
        names = [path.name for path in folder.iterdir() if path.name.isdigit()] if folder.is_dir() else []
        return tuple(int(name) for name in names if self.is_running(int(name)))

    def is_running(self, process_id: int) -> bool:
        is_started = (self.home.folder / FOLDER_NAME / str(process_id) / FIRST_STARTED_FILE).exists()
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

    # The bytes of the parts' output, in order, from the offset on; only the part files that reach past it are opened.
    def bytes_after(self, process_id: int, offset: int) -> bytes:
        passed, collected = 0, b""
        for path in self.output_paths(process_id):
            size = path.stat().st_size if path.exists() else 0
            if size and passed + size > offset:
                with path.open("rb") as handle:
                    handle.seek(max(0, offset - passed))
                    collected += handle.read()
            passed += size
        return collected

    # The bytes of the parts' output from first up to last; only the part files that reach into them are opened.
    def byte_range(self, process_id: int, first: int, last: int) -> bytes:
        passed, collected = 0, b""
        for path in self.output_paths(process_id):
            size = path.stat().st_size if path.exists() else 0
            if size and passed + size > first and passed < last:
                with path.open("rb") as handle:
                    handle.seek(max(0, first - passed))
                    collected += handle.read(last - max(first, passed))
            passed += size
        return collected

    # The last lines that end at a byte, or at the output's end when end is below 0, read in windows that double
    # until they hold the lines asked for.
    def older_page(self, process_id: int, end: int, count: int) -> OutputPage:
        total = self.total_bytes(process_id)
        last_byte = total if end < 0 else min(end, total)
        window = TAIL_BYTES
        while True:
            first_byte = max(0, last_byte - window)
            lines = self.byte_range(process_id, first_byte, last_byte).split(NEWLINE)
            if first_byte and len(lines) > 1:
                first_byte += len(lines.pop(0)) + 1
            if lines and not lines[-1]:
                lines.pop()
            if not first_byte or len(lines) >= count:
                kept = lines[-count:]
                dropped = sum(len(line) + 1 for line in lines[:-count]) if len(lines) > count else 0
                return OutputPage(self.page_text(kept), first_byte + dropped, last_byte, total, self.cut_bytes(process_id))
            window *= 2

    # The lines after a byte, at most a window of them, so a following view reads only what is new; a line
    # still being written waits, unless it fills the window alone, and the last one of an ended run comes
    # without its newline.
    def page_after(self, process_id: int, first: int, has_ended: bool) -> OutputPage:
        total = self.total_bytes(process_id)
        ready = self.byte_range(process_id, first, first + PAGE_BYTES)
        is_last = has_ended and first + len(ready) >= total
        fills_window = NEWLINE not in ready and len(ready) >= PAGE_BYTES
        ready = ready if is_last or fills_window else ready[: ready.rfind(NEWLINE) + 1]
        lines = ready.split(NEWLINE)
        return OutputPage(self.page_text(lines if lines[-1] else lines[:-1]), first, first + len(ready), total, self.cut_bytes(process_id))

    @staticmethod
    def page_text(lines: list[bytes]) -> list[str]:
        return [ColourCodes.removed(line.decode(errors="replace")) for line in lines]

    # The bytes the runner dropped from a part, or from every part with no position.
    def cut_bytes(self, process_id: int, position: int = 0) -> int:
        positions = [position] if position else range(1, len(self.part_texts(process_id)) + 1)
        files = [self.home.folder / FOLDER_NAME / str(process_id) / f"{number}.cut-bytes" for number in positions]
        return sum(int(path.read_text()) for path in files if path.exists())

    # Where in the file a reader goes on. Its offset counts every byte ever written, so a cut moves the place
    # by the bytes dropped; a place that was dropped or lies past the file starts again at the top.
    def reader_offset(self, process_id: int, position: int, offset: int) -> int:
        paths = [self.home.folder / FOLDER_NAME / str(process_id) / f"{position}.out"] if position else self.output_paths(process_id)
        size = sum(path.stat().st_size for path in paths if path.exists())
        place = offset - self.cut_bytes(process_id, position)
        return place if 0 <= place <= size else 0

    def reader_bytes_after(self, process_id: int, position: int, offset: int) -> bytes:
        if not position:
            return self.bytes_after(process_id, offset)
        path = self.home.folder / FOLDER_NAME / str(process_id) / f"{position}.out"
        if not path.exists():
            return b""
        with path.open("rb") as handle:
            handle.seek(offset)
            return handle.read()

    # A part's text read for judging a reader: whole up to two pages, else its first and its last page cut to whole
    # lines, so a run that printed many megabytes is never read whole inside a write.
    def sample_text(self, process_id: int, position: int) -> str:
        paths = [self.home.folder / FOLDER_NAME / str(process_id) / f"{position}.out"] if position else self.output_paths(process_id)
        return ColourCodes.removed(b"".join(self.edges(path) for path in paths if path.exists()).decode("utf-8", errors="replace"))

    @staticmethod
    def edges(path: Path) -> bytes:
        size = path.stat().st_size
        with path.open("rb") as handle:
            if size <= 2 * PAGE_BYTES:
                return handle.read()
            head = handle.read(PAGE_BYTES)
            handle.seek(size - PAGE_BYTES)
            tail = handle.read()
        return head[:head.rfind(b"\n") + 1] + tail[tail.find(b"\n") + 1:]

    def reader_text(self, process_id: int, position: int) -> str:
        return ColourCodes.removed(self.output(process_id, position)) if position else self.all_output(process_id)

    def last_text(self, process_id: int) -> str:
        return "\n".join(self.last_lines(process_id, COUNT_LINES))

    # The last lines, read from the end in windows that double until they hold one line more than asked,
    # which drops a line cut by the window's start.
    def last_lines(self, process_id: int, count: int) -> list[str]:
        total = self.total_bytes(process_id)
        window = TAIL_BYTES
        while True:
            lines = ColourCodes.removed(self.bytes_after(process_id, max(0, total - window)).decode(errors="replace")).splitlines()
            if window >= total or len(lines) > count:
                return lines[-count:]
            window *= 2

    # The lines numbered first to last, counted from 1; the parts are read in chunks up to the last line wanted.
    def numbered_lines(self, process_id: int, first: int, last: int) -> list[tuple[int, str]]:
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
    # The lines of the text that end in a line break, and what follows the last one; a last piece that has no
    # break, or ends in a carriage return that a line feed may follow, waits for more text.
    def split_complete(text: str) -> tuple[list[str], str]:
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

    def head_output(self, process_id: int, characters: int) -> str:
        text = ""
        for position in range(1, len(self.part_texts(process_id)) + 1):
            if len(text) >= characters:
                break
            text += self.part_head(process_id, position, characters - len(text)).decode("utf-8", errors="ignore")
        return ColourCodes.removed(text)

    def all_output(self, process_id: int) -> str:
        return ColourCodes.removed("".join(self.output(process_id, position) for position in range(1, len(self.part_texts(process_id)) + 1)))

    # The bytes and the lines of all the parts, counted in chunks; a part without a last line feed still has
    # its last line.
    def sizes(self, process_id: int) -> tuple[int, int]:
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

    def read_mark(self, process_id: int, mark: str) -> str:
        path = self.home.folder / FOLDER_NAME / str(process_id) / READS_FILE
        marks = dict(line.rsplit(" ", 1) for line in path.read_text().splitlines()) if path.is_file() else {}
        return marks.get(mark, "")

    def write_read_mark(self, process_id: int, mark: str, read_at: str) -> None:
        (self.home.folder / FOLDER_NAME / str(process_id)).mkdir(parents=True, exist_ok=True)
        with FileAccess.shared().writer(self.home.folder / FOLDER_NAME / str(process_id) / READS_FILE, "a") as marks:
            marks.write(f"{mark} {read_at}\n")

    def process_ids(self) -> list[int]:
        root = self.home.folder / FOLDER_NAME
        return sorted(int(path.name) for path in root.iterdir() if path.name.isdigit()) if root.is_dir() else []

    def write_number(self, process_id: int, name: str, number: int) -> None:
        self.write(process_id, name, f"{number}")

    def write(self, process_id: int, name: str, text: str) -> None:
        folder = self.home.folder / FOLDER_NAME / str(process_id)
        folder.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(folder / name, text)

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

    def count_error(self, process_id: int) -> list[str]:
        status = self.count_status(process_id)
        if status is None or status == 0:
            return []
        return self.count_text(process_id).splitlines()[-20:]

    def is_count_claimed(self, process_id: int) -> bool:
        return (self.home.folder / FOLDER_NAME / str(process_id) / "count-taken").exists()

    def mark_count_claimed(self, process_id: int) -> None:
        self.write(process_id, "count-taken", "1")

    def write_count(self, process_id: int, text: str, status: int) -> None:
        self.write(process_id, COUNT_OUTPUT, text)
        self.write_number(process_id, COUNT_STATUS, status)

    def progress_count_status(self, process_id: int) -> int | None:
        return self.number(process_id, "progress-count/counted")

    def progress_count_text(self, process_id: int) -> str:
        return self.text(process_id, "progress-count/count.out")

    def has_progress_count(self, process_id: int) -> bool:
        return (self.home.folder / FOLDER_NAME / str(process_id) / "count-known").exists()

    def mark_progress_count(self, process_id: int) -> None:
        self.write(process_id, "count-known", "1")

    def progress_count_read(self, process_id: int) -> bool:
        return (self.home.folder / FOLDER_NAME / str(process_id) / "progress-count-read").exists()

    def mark_progress_count_read(self, process_id: int) -> None:
        self.write(process_id, "progress-count-read", "1")

    def write_progress_count(self, process_id: int, text: str, status: int) -> None:
        folder = self.home.folder / FOLDER_NAME / str(process_id) / "progress-count"
        folder.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(folder / COUNT_OUTPUT, text)
        FileAccess.shared().write(folder / COUNT_STATUS, str(status))
