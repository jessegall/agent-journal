import json
import re
import time
from pathlib import Path

from controllers.types import CONTROLLERS
from engine.record import Record
from resources.base import SYSTEM

ROWS = 4
ESC = "\x1b"
STYLE = f"{ESC}[48;2;23;24;27m{ESC}[38;2;169;172;179m"
BRIGHT = f"{ESC}[38;2;230;231;234m"
ACCENT = f"{ESC}[38;2;163;168;240m"
DIM = f"{ESC}[38;2;131;134;142m"
RESET = f"{ESC}[0m"
STATES = {"idle": "●", "working": "◐", "waiting": "◔", "stopped": "○"}
BRAND = "AGENT JOURNAL"
GRADIENT = ((36, 38, 78), (94, 99, 222), (36, 38, 78))


def region(rows: int) -> bytes:
    return f"{ESC}[{ROWS + 1};{rows}r{ESC}[{ROWS + 1};1H".encode()


def release() -> bytes:
    return f"{ESC}[r".encode()


CURSOR = re.compile(rb"\x1b\[(\d*)(?:;(\d*))?([Hfdr])")
PARTIAL = re.compile(rb"\x1b(\[[\d;]*)?$")


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


def since(at: float) -> str:
    s = int(time.time() - at) if at else 0
    return f"{s // 3600}h{(s % 3600) // 60:02d}" if s >= 3600 else f"{s // 60}m{s % 60:02d}"


class Band:
    def __init__(self, root: Path, env: str, session: str, project: str):
        self.root, self.env, self.session, self.project = root, env, session, project
        self.shown = b""

    def seat(self) -> dict:
        try:
            return json.loads((self.root / "runtime" / f"seat-{self.session}.json").read_text())
        except (OSError, ValueError):
            return {}

    def agent(self) -> dict:
        record = Record(self.root, self.seat().get("env") or self.env)
        rows = [r for r in CONTROLLERS["agent"](record, actor=SYSTEM).all() if r.data.get("event")]
        rows.sort(key=lambda r: float(r.data.get("at") or 0))
        return {"title": rows[-1].title, **rows[-1].data} if rows else {}

    def lines(self, cols: int) -> list[str]:
        seat, agent = self.seat(), self.agent()
        state = seat.get("state") or agent.get("status") or "stopped"
        mark = STATES.get(state, "○")
        env = seat.get("env") or self.env
        facts = f"{BRIGHT}{self.project}{DIM} · environment {BRIGHT}{env}"
        status = (f"{ACCENT}{mark} {BRIGHT}{state}{DIM}  {agent.get('model') or agent.get('provider') or '—'} · {agent.get('title', '')[:8]}"
                  f" · up {since(float(agent.get('started') or 0))} · context {round(float(agent.get('context') or 0))}%")
        rule = f"{ESC}[38;2;47;49;54m{'─' * cols}"
        return [self.banner(env, cols)] + [self.fit(line, cols) for line in (facts, status, rule)]

    def shade(self, x: int, cols: int) -> tuple[int, int, int]:
        t = x / max(1, cols - 1) * (len(GRADIENT) - 1)
        a, b = GRADIENT[int(t)], GRADIENT[min(int(t) + 1, len(GRADIENT) - 1)]
        f = t - int(t)
        return tuple(round(a[i] + (b[i] - a[i]) * f) for i in range(3))

    def banner(self, env: str, cols: int) -> str:
        left, right = f"  {BRAND}", f"{env.upper()}  "
        text = left + " " * max(1, cols - len(left) - len(right)) + right
        cells = []
        for x, ch in enumerate(text[:cols]):
            r, g, b = self.shade(x, cols)
            cells.append(f"{ESC}[48;2;{r};{g};{b}m{ch}")
        return f"{ESC}[1m{ESC}[38;2;245;246;250m" + "".join(cells)

    def fit(self, line: str, cols: int) -> str:
        plain = 0
        out = []
        i = 0
        while i < len(line):
            if line[i] == ESC:
                j = line.index("m", i) + 1
                out.append(line[i:j])
                i = j
                continue
            if plain >= cols:
                break
            out.append(line[i])
            plain += 1
            i += 1
        left = max(0, (cols - plain) // 2)
        return " " * left + "".join(out) + " " * (cols - plain - left)

    def draw(self, cols: int, force: bool = False) -> bytes:
        body = "".join(f"{ESC}[{n + 1};1H{STYLE}{line}{RESET}" for n, line in enumerate(self.lines(cols)))
        drawn = f"{ESC}7{body}{ESC}8".encode()
        if drawn == self.shown and not force:
            return b""
        self.shown = drawn
        return drawn
