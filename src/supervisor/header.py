import os
import re

ACCENT_BAR, BOLD, RESET = "\x1b[48;5;24m\x1b[38;5;255m", "\x1b[1m", "\x1b[0m"
HOME, CLEAR = b"\x1b[H", b"\x1b[2J"
HOME_UNDER, CLEAR_UNDER = b"\x1b[2;1H", b"\x1b[2;1H\x1b[J"
DISTURBS = re.compile(rb"\x1b\[[0-9;]*r|\x1b\[[0-3]?J|\x1b\[(?:1|0)?(?:;[0-9]*)?H|\x1bc")
"""A scroll-region reset, a screen clear, a move to the first row or a full reset: each would wipe the line."""


class Header:
    """The one line always at the top of the agent's screen: the package on the left, the project and environment in the middle, the viewer's URL on the right. The agent has the rows under it, as a scroll region, and its screen clears never reach the line."""

    def __init__(self, project: str, environment: str, stdout: int = 1) -> None:
        self.project, self.environment, self.stdout = project, environment, stdout
        self.url = ""
        self.rows, self.columns = 24, 80

    def begin(self, rows: int, columns: int) -> None:
        """Clears the whole screen and the scrollback, so nothing can scroll past the line, draws it and gives the agent the rows under it."""
        self.rows, self.columns = rows, columns
        os.write(self.stdout, b"\x1b[2J\x1b[3J" + self.line() + f"\x1b[2;{rows}r".encode() + HOME_UNDER)

    def end(self) -> None:
        os.write(self.stdout, b"\x1b[r\x1b[2J\x1b[H")

    def resize(self, rows: int, columns: int) -> None:
        self.begin(rows, columns)

    def set_url(self, url: str) -> None:
        self.url = url
        self.redraw()

    def redraw(self) -> None:
        os.write(self.stdout, b"\x1b7" + self.line() + b"\x1b8")

    def line(self) -> bytes:
        left, middle, right = "agent-journal", f"{self.project} · {self.environment}", self.url or "journal starting…"
        gap = self.columns - len(left) - len(right)
        centred = middle.center(gap) if len(middle) <= gap else middle[: max(gap, 0)]
        text = f"{left}{centred}{right}"[: self.columns]
        return f"\x1b[H{ACCENT_BAR}{BOLD}\x1b[K{text}{RESET}".encode()

    def shield(self, data: bytes) -> bytes:
        """The agent's clear-screen and home moves, moved to the row under the line; after anything that resets the screen or the scroll region, the line and the region are drawn again."""
        shielded = data.replace(CLEAR, CLEAR_UNDER).replace(HOME, HOME_UNDER)
        return shielded + self.restored() if DISTURBS.search(data) else shielded

    def restored(self) -> bytes:
        return b"\x1b7" + f"\x1b[2;{self.rows}r".encode() + self.line() + b"\x1b8"

    @property
    def agent_rows(self) -> int:
        return max(self.rows - 1, 1)
