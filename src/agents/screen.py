import base64
import os
import select
import sys
import termios
import tty
from dataclasses import dataclass
from pathlib import Path

from engine import runtime, typist
from engine.stored import read_json
from supervisor import SCREEN, SCREEN_SHAPE


DETACH = b"\x1d"
SHOWN_BACK = 65536


@dataclass(frozen=True)
class ScreenPart:
    data: str
    at: int
    rows: int
    cols: int

    @classmethod
    def blank(cls, rows: int, cols: int) -> "ScreenPart":
        return cls("", 0, rows, cols)


def screen_since(root: Path, terminal: str, since: int) -> ScreenPart:
    screen = runtime.session_file(root, terminal, SCREEN)
    shape = read_json(runtime.session_file(root, terminal, SCREEN_SHAPE), dict, {"rows": 40, "cols": 120})
    if not screen.is_file():
        return ScreenPart.blank(int(shape["rows"]), int(shape["cols"]))
    size = screen.stat().st_size
    at = max(0, size - SHOWN_BACK) if since < 0 or since > size else since
    with screen.open("rb") as shown:
        shown.seek(at)
        fresh = shown.read(size - at)
    return ScreenPart(base64.b64encode(fresh).decode(), at + len(fresh), int(shape["rows"]), int(shape["cols"]))


def attach(root: Path, session: str) -> str:
    screen = runtime.session_file(root, session, SCREEN)
    if not screen.is_file():
        return f"journal: no session {session} to attach to"
    at = max(0, screen.stat().st_size - SHOWN_BACK)
    saved = termios.tcgetattr(sys.stdin.fileno())
    tty.setraw(sys.stdin.fileno())
    try:
        while True:
            with screen.open("rb") as shown:
                shown.seek(at)
                fresh = shown.read()
            at += len(fresh)
            os.write(sys.stdout.fileno(), fresh)
            ready, _, _ = select.select([sys.stdin.fileno()], [], [], 0.2)
            if ready:
                keys = os.read(sys.stdin.fileno(), 4096)
                if not keys or DETACH in keys:
                    break
                typist.send(root, session, keys)
    finally:
        termios.tcsetattr(sys.stdin.fileno(), termios.TCSADRAIN, saved)
    return f"\njournal: left session {session}; it runs on"

