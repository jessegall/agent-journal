import time
from pathlib import Path

from engine.transcript import IDLE
from providers import PROVIDERS

SETTLE, SETTLE_STEP = 1.5, 0.05
TURNS: dict[str, tuple] = {}


def settled(provider, path: Path, agent) -> None:
    until = time.time() + SETTLE
    while agent.status == IDLE and provider.settling(path) and time.time() < until:
        time.sleep(SETTLE_STEP)


def turns(record, agent) -> list:
    provider = PROVIDERS.get(agent.provider)
    if not provider or not agent.transcript:
        return []
    try:
        settled(provider(), Path(agent.transcript), agent)
        size = Path(agent.transcript).stat().st_size
    except OSError:
        return []
    held = TURNS.get(agent.transcript)
    if not held or held[0] != size:
        held = TURNS[agent.transcript] = (size, [t for t in provider().transcript(agent.transcript) if t.has_agent_text])
    return held[1]


def last_turn(record, agent):
    provider = PROVIDERS.get(agent.provider)
    if not provider or not agent.transcript:
        return None
    settled(provider(), Path(agent.transcript), agent)
    recent = [t for t in provider().tail(agent.transcript) if t.has_agent_text] or turns(record, agent)
    return recent[-1] if recent else None


def last_text(record, agent) -> str:
    written = last_turn(record, agent)
    return written.text if written else ""
