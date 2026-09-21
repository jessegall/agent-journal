from pathlib import Path

from providers import PROVIDERS

TURNS: dict[str, tuple] = {}


def turns(record, agent) -> list:
    provider = PROVIDERS.get(agent.provider)
    if not provider or not agent.transcript:
        return []
    try:
        size = Path(agent.transcript).stat().st_size
    except OSError:
        return []
    held = TURNS.get(agent.transcript)
    if not held or held[0] != size:
        held = TURNS[agent.transcript] = (size, [t for t in provider().transcript(agent.transcript) if t.who == "agent" and t.text.strip()])
    return held[1]


def last_turn(record, agent):
    said = turns(record, agent)
    return said[-1] if said else None


def last_said(record, agent) -> str:
    said = last_turn(record, agent)
    return said.text if said else ""
