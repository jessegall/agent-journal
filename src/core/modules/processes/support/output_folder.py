import shutil
from core.base.journal_home import JournalHome
from core.base.timestamp import Timestamp

FOLDER_NAME = "processes"
LINE_FILE = "line"
PARTS_FILE = "parts"
PID_FILE = "pid"
END_FILE = "end"
HEARTBEAT_FILE = "heartbeat"


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

    def heartbeat(self, process_id: int) -> Timestamp | None:
        text = self.text(process_id, HEARTBEAT_FILE).strip()
        return Timestamp.parsed(text) if text else None

    def all_output(self, process_id: int) -> str:
        return "".join(self.output(process_id, position) for position in range(1, len(self.part_texts(process_id)) + 1))

    def sizes(self, process_id: int) -> tuple[int, int]:
        texts = [self.output(process_id, position) for position in range(1, len(self.part_texts(process_id)) + 1)]
        return sum(len(text.encode()) for text in texts), sum(text.count("\n") + (0 if not text or text.endswith("\n") else 1) for text in texts)

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
        return path.read_text() if path.exists() else ""

    def number(self, process_id: int, name: str) -> int | None:
        text = self.text(process_id, name).strip()
        return int(text) if text.lstrip("-").isdigit() else None
