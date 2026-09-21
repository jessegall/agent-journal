import json
import re
import unicodedata
import time
from datetime import datetime
from pathlib import Path

from controllers.types import Agents
from engine.record import Record
from engine.viewer import marked, running
from resources.base import SYSTEM

ROWS = 3
ESC = "\x1b"
STYLE = f"{ESC}[48;2;23;24;27m{ESC}[38;2;169;172;179m"
URL = f"{ESC}[48;2;52;55;105m{ESC}[38;2;238;239;246m"
RESET = f"{ESC}[0m"
BELL = "\x07"
BRAND = "JOURNAL"
GRADIENT = ((36, 38, 78), (94, 99, 222), (36, 38, 78))


def linked(url: str, line: str) -> str:
    return f"{ESC}]8;;{url}{BELL}{line}{ESC}]8;;{BELL}" if url.startswith("http") else line


def region(rows: int) -> bytes:
    return f"{ESC}[{ROWS + 1};{rows}r{ESC}[{ROWS + 1};1H".encode()


def release() -> bytes:
    wiped = "".join(f"{ESC}[{n};1H{ESC}[2K" for n in range(1, ROWS + 1))
    return f"{ESC}[r{ESC}7{wiped}{ESC}8".encode()


CURSOR = re.compile(rb"\x1b\[(\d*)(?:;(\d*))?([Hfdr])")
SGR_CLICK = re.compile(rb"\x1b\[<(\d+);(\d+);(\d+)([Mm])")
OLD_CLICK = re.compile(rb"\x1b\[M(...)", re.S)
PARTIAL = re.compile(rb"\x1b(\[[\d;?]*|\][^\x07\x1b]*\x1b?)?$")


def unshifted(data: bytes) -> bytes:
    data = SGR_CLICK.sub(lambda m: b"\x1b[<%s;%s;%d%s" % (m.group(1), m.group(2), max(1, int(m.group(3)) - ROWS), m.group(4)), data)
    return OLD_CLICK.sub(lambda m: b"\x1b[M" + m.group(1)[:2] + bytes([max(33, m.group(1)[2] - ROWS)]), data)


MOVE = re.compile(rb"\x1b\[(\d*)(?:;(\d*))?([HfdABCDG])")
SHOW = re.compile(rb"\x1b\[\?25([hl])")
ESCAPE = re.compile(rb"\x1b(?:\[[\d;?]*[ -/]*[@-~]|\][^\x07\x1b]*(?:\x07|\x1b\\)|[()][0-9A-B]|[78=>cDEHM]|[@-Z\\-_])")


def wide(ch: str) -> int:
    if unicodedata.combining(ch):
        return 0
    return 2 if unicodedata.east_asian_width(ch) in ("W", "F") else 1


class Cursor:
    def __init__(self, rows: int, cols: int):
        self.rows, self.cols = rows, cols
        self.row, self.col = ROWS + 1, 1
        self.saved = (ROWS + 1, 1)
        self.shown = True
        self.sure = True

    def resized(self, rows: int, cols: int) -> None:
        self.rows, self.cols = rows, cols
        self.sure = False

    def placed(self, m: re.Match) -> None:
        kind, first, second = m.group(3), m.group(1), m.group(2)
        one = int(first) if first else (0 if kind in b"ABCD" else 1)
        if kind in (b"H", b"f"):
            self.row, self.col = one, int(second) if second else 1
        elif kind == b"d":
            self.row = one
        elif kind == b"G":
            self.col = one
        elif kind == b"A":
            self.row -= max(1, one)
        elif kind == b"B":
            self.row += max(1, one)
        elif kind == b"C":
            self.col += max(1, one)
        elif kind == b"D":
            self.col -= max(1, one)
        self.row = min(max(self.row, 1), self.rows)
        self.col = min(max(self.col, 1), self.cols)

    def wrote(self, plain: bytes) -> None:
        for ch in plain.decode("utf-8", "ignore"):
            if ch == "\n":
                self.row += 1
            elif ch == "\r":
                self.col = 1
            elif ch == "\b":
                self.col = max(1, self.col - 1)
            elif ch >= " ":
                self.col += wide(ch)
            if self.col > self.cols:
                self.row, self.col = self.row + 1, 1
            if self.row > self.rows:                 # the screen scrolled: the tracker cannot know by how much
                self.row, self.sure = self.rows, False

    def feed(self, data: bytes) -> None:
        at = 0
        for m in ESCAPE.finditer(data):
            self.wrote(data[at:m.start()])
            self.escaped(m.group(0))
            at = m.end()
        self.wrote(data[at:])

    def escaped(self, seq: bytes) -> None:
        if seq == b"\x1b7":
            self.saved = (self.row, self.col)
        elif seq == b"\x1b8":
            self.row, self.col = self.saved
            self.sure = True
        elif (shown := SHOW.fullmatch(seq)):
            self.shown = shown.group(1) == b"h"
        elif (move := MOVE.fullmatch(seq)):
            self.placed(move)
            self.sure = True

    def at(self) -> bytes:
        if not self.sure:
            return b""
        return b"\x1b[%d;%dH" % (self.row, self.col) + (b"\x1b[?25h" if self.shown else b"")


class Translator:
    def __init__(self, rows: int):
        self.rows = rows
        self.held = b""

    def shifted(self, m: re.Match) -> bytes:
        kind = m.group(3)
        first = int(m.group(1) or 1) + ROWS
        if kind == b"d":
            return b"\x1b[%dd" % first
        if kind == b"r":
            bottom = int(m.group(2)) + ROWS if m.group(2) else self.rows
            return b"\x1b[%d;%dr" % (first, bottom)
        return b"\x1b[%d;%s%s" % (first, m.group(2) or b"1", kind)

    def feed(self, data: bytes) -> bytes:
        data = self.held + data
        cut = PARTIAL.search(data)
        if cut:
            data, self.held = data[:cut.start()], data[cut.start():]
        else:
            self.held = b""
        return CURSOR.sub(self.shifted, data)


class Band:
    def __init__(self, root: Path, env: str, session: str, project: str):
        self.root, self.env, self.session, self.project = root, env, session, project
        self.shown = b""
        self.url = ""
        self.url_at = 0.0
        self.asked_at = 0.0

    def seat(self) -> dict:
        try:
            return json.loads((self.root / "runtime" / f"seat-{self.session}.json").read_text())
        except (OSError, ValueError):
            return {}

    def agent(self, seat: dict) -> dict:
        if seat.get("report"):
            return seat["report"]
        record = Record(self.root, seat.get("env") or self.env)
        agent = Agents(record, actor=SYSTEM).primary()
        return {"title": agent.title, **agent.data} if agent and agent.event else {}

    def viewer(self) -> str:
        now = time.time()
        if now - self.url_at >= 10:
            self.url = running(self.root) or self.url
            self.url_at = now
        elif not self.url and now - self.asked_at >= 1:
            self.url = marked(self.root)
            self.asked_at = now
        return self.url or "viewer unavailable"

    def lines(self, cols: int) -> list[str]:
        seat = self.seat()
        env = seat.get("env") or self.env
        rule = f"{ESC}[38;2;47;49;54m{'─' * cols}"
        where = self.viewer()
        return [self.banner(cols, env, self.agent(seat)), linked(where, self.fit(f"{URL}{where}{STYLE}", cols)), self.fit(rule, cols)]

    def shade(self, x: int, cols: int) -> tuple[int, int, int]:
        t = x / max(1, cols - 1) * (len(GRADIENT) - 1)
        a, b = GRADIENT[int(t)], GRADIENT[min(int(t) + 1, len(GRADIENT) - 1)]
        f = t - int(t)
        return tuple(round(a[i] + (b[i] - a[i]) * f) for i in range(3))

    def banner(self, cols: int, env: str, agent: dict) -> str:
        left = max(0, (cols - len(BRAND)) // 2)
        clock = datetime.now().strftime("%H:%M:%S")
        left_text = f"{self.project} · {env}"
        right_text = f"context {round(float(agent.get('context') or 0))}% · {clock}"
        text = list(" " * cols)
        text[2:min(cols, 2 + len(left_text))] = left_text[:max(0, cols - 2)]
        text[left:min(cols, left + len(BRAND))] = BRAND[:max(0, cols - left)]
        right = max(2, cols - len(right_text) - 2)
        if right > left + len(BRAND):
            text[right:min(cols, right + len(right_text))] = right_text[:max(0, cols - right)]
        cells = []
        for x, ch in enumerate(text):
            r, g, b = self.shade(x, cols)
            cells.append(f"{ESC}[48;2;{r};{g};{b}m{ch}")
        return f"{ESC}[1m{ESC}[38;2;245;246;250m" + "".join(cells)

    def fit(self, line: str, cols: int, left: int = -1) -> str:
        plain = 0
        out = []
        i = 0
        while i < len(line):
            if line[i] == ESC:
                j = line.index("m", i) + 1
                out.append(line[i:j])
                i = j
                continue
            if plain >= cols - max(0, left):
                break
            out.append(line[i])
            plain += 1
            i += 1
        left = max(0, (cols - plain) // 2) if left < 0 else min(left, cols - plain)
        return " " * left + "".join(out) + " " * (cols - plain - left)

    def draw(self, cols: int, force: bool = False, cursor: "Cursor | None" = None) -> bytes:
        body = "".join(f"{ESC}[{n + 1};1H{STYLE}{line}{RESET}" for n, line in enumerate(self.lines(cols)))
        back = cursor.at() if cursor else b""
        drawn = (f"{ESC}[?25l" if back else f"{ESC}7").encode() + body.encode() + (back or f"{ESC}8".encode())
        if drawn == self.shown and not force:
            return b""
        self.shown = drawn
        return drawn
