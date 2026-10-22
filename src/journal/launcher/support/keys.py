import os
import re
import select

KEY_GAP_SECONDS = 0.05
PATTERN = re.compile(r"\x1b[\[O][A-Za-z]|\x1b|[^\x1b]")


class Keys:
    """Keys from a terminal in cbreak mode, one at a time: an arrow comes as one key, not as its escape and letters."""

    UPWARD, DOWN = ("\x1b[A", "\x1bOA", "k"), ("\x1b[B", "\x1bOB", "j")
    ENTER, ESCAPE = ("\r", "\n"), "\x1b"

    def __init__(self, fd: int) -> None:
        self.fd = fd

    def read(self) -> list[str]:
        raw = os.read(self.fd, 64)
        if not raw:
            raise SystemExit("journal: the input ended before a choice was made")
        while raw.endswith((b"\x1b", b"\x1b[", b"\x1bO")) and select.select([self.fd], [], [], KEY_GAP_SECONDS)[0]:
            raw += os.read(self.fd, 64)
        return PATTERN.findall(raw.decode(errors="ignore"))
