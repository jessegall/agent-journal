import json
import re
import time
from datetime import datetime
from pathlib import Path

from controllers.types import Agents
from engine.record import Record
from engine.viewer import marked, running
from resources.base import SYSTEM

ROWS = 4
ESC = "\x1b"
STYLE = f"{ESC}[48;2;23;24;27m{ESC}[38;2;169;172;179m"
URL = f"{ESC}[48;2;52;55;105m{ESC}[38;2;238;239;246m"
RESET = f"{ESC}[0m"
BRAND = "JOURNAL"
GRADIENT = ((36, 38, 78), (94, 99, 222), (36, 38, 78))


def region(rows: int) -> bytes:
    return f"{ESC}[{ROWS + 1};{rows}r{ESC}[{ROWS + 1};1H".encode()


def release() -> bytes:
    return f"{ESC}[r".encode()


CURSOR = re.compile(rb"\x1b\[(\d*)(?:;(\d*))?([Hfdr])")
PARTIAL = re.compile(rb"\x1b(\[[\d;?]*|\][^\x07\x1b]*\x1b?)?$")


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
        return [self.banner(cols, env, self.agent(seat)), self.fit(f"{URL}{self.viewer()}{STYLE}", cols), " " * cols, self.fit(rule, cols)]

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

    def draw(self, cols: int, force: bool = False) -> bytes:
        body = "".join(f"{ESC}[{n + 1};1H{STYLE}{line}{RESET}" for n, line in enumerate(self.lines(cols)))
        drawn = f"{ESC}7{body}{ESC}8".encode()
        if drawn == self.shown and not force:
            return b""
        self.shown = drawn
        return drawn
