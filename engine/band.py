import json
import time
from pathlib import Path

from controllers.types import CONTROLLERS
from engine.record import Record
from resources.base import SYSTEM

ROWS = 3
ESC = "\x1b"
STYLE = f"{ESC}[48;2;23;24;27m{ESC}[38;2;169;172;179m"
BRIGHT = f"{ESC}[38;2;230;231;234m"
ACCENT = f"{ESC}[38;2;163;168;240m"
DIM = f"{ESC}[38;2;131;134;142m"
RESET = f"{ESC}[0m"
STATES = {"idle": "●", "working": "◐", "waiting": "◔", "stopped": "○"}


def region(rows: int) -> bytes:
    return f"{ESC}[{ROWS + 1};{rows}r{ESC}[?6h{ESC}[H".encode()


def release() -> bytes:
    return f"{ESC}[r{ESC}[?6l".encode()


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
        first = f" {ACCENT}◆ journal{DIM}  {BRIGHT}{self.project}{DIM} · environment {BRIGHT}{seat.get('env') or self.env}"
        second = (f" {ACCENT}{mark} {BRIGHT}{state}{DIM}  {agent.get('model') or agent.get('provider') or '—'} · {agent.get('title', '')[:8]}"
                  f" · up {since(float(agent.get('started') or 0))} · {agent.get('uses', 0)} tool uses · context {agent.get('context', 0)}%")
        third = f" {DIM}{seat.get('why') or 'starting'}"
        return [self.fit(line, cols) for line in (first, second, third)]

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
        return "".join(out) + " " * (cols - plain)

    def draw(self, cols: int) -> bytes:
        body = "".join(f"{ESC}[{n + 1};1H{STYLE}{line}{RESET}" for n, line in enumerate(self.lines(cols)))
        drawn = f"{ESC}7{ESC}[?6l{body}{ESC}[?6h{ESC}8".encode()
        return drawn
