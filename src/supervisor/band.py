import os
import re

from supervisor.band_labels import BandLabels

ACCENT_STYLE, BOLD, RESET = "\x1b[48;5;24m\x1b[38;5;255m", "\x1b[1m", "\x1b[0m"
HOME, CLEAR = b"\x1b[H", b"\x1b[2J"
HOME_SECOND_ROW, CLEAR_SECOND_ROW = b"\x1b[2;1H", b"\x1b[2;1H\x1b[J"
DISTURBS = re.compile(rb"\x1b\[[0-9;]*r|\x1b\[[0-3]?J|\x1b\[(?:1|0)?(?:;[0-9]*)?H|\x1bc")


class Band:
    """The one line always at the top of the agent's screen, in the words it is given: one on the left, one in the middle, one on the right. The agent has the rows under it, as a scroll region, and its screen clears never reach the line."""

    def __init__(self, labels: BandLabels, stdout: int = 1) -> None:
        self.labels, self.stdout = labels, stdout
        self.rows, self.columns = 24, 80

    def begin(self, rows: int, columns: int) -> None:
        self.rows, self.columns = rows, columns
        os.write(self.stdout, b"\x1b[2J\x1b[3J" + self.line() + f"\x1b[2;{rows}r".encode() + HOME_SECOND_ROW)

    def end(self) -> None:
        os.write(self.stdout, b"\x1b[r\x1b[2J\x1b[H")

    def resize(self, rows: int, columns: int) -> None:
        self.begin(rows, columns)

    def display(self, labels: BandLabels) -> None:
        self.labels = labels
        self.redraw()

    def redraw(self) -> None:
        os.write(self.stdout, b"\x1b7" + self.line() + b"\x1b8")

    def line(self) -> bytes:
        start_text, middle, end_text = self.labels.start_label, self.labels.middle_label, self.labels.end_label
        gap = self.columns - len(start_text) - len(end_text)
        centred = middle.center(gap) if len(middle) <= gap else middle[: max(gap, 0)]
        text = f"{start_text}{centred}{end_text}"[: self.columns]
        return f"\x1b[H{ACCENT_STYLE}{BOLD}\x1b[K{text}{RESET}".encode()

    def shield(self, data: bytes) -> bytes:
        shielded = data.replace(CLEAR, CLEAR_SECOND_ROW).replace(HOME, HOME_SECOND_ROW)
        return shielded + self.restored() if DISTURBS.search(data) else shielded

    def restored(self) -> bytes:
        return b"\x1b7" + f"\x1b[2;{self.rows}r".encode() + self.line() + b"\x1b8"

    @property
    def agent_rows(self) -> int:
        return max(self.rows - 1, 1)
