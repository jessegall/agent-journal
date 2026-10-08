import time
from pathlib import Path

from engine.transcript import IDLE
from controllers.types import Agents, environment_records
from providers import PROVIDERS, transcript_reader
from providers.jsonl import WholeRead
from resources.base import SYSTEM

SETTLE, SETTLE_STEP = 1.5, 0.05
TURNS: dict[str, tuple] = {}


def settled(provider, path: Path, agent) -> None:
    until = time.time() + SETTLE
    while agent.status == IDLE and provider.settling(path) and time.time() < until:
        time.sleep(SETTLE_STEP)


def _settled_provider(agent):
    provider = transcript_reader(agent)
    if provider is None:
        return None
    settled(provider, Path(agent.transcript), agent)
    return provider


def every_turn(agent) -> list:
    """All the turns of an agent's transcript, read again only when the file has grown, so a search asks a warm copy instead of parsing the transcript each time."""
    try:
        provider = _settled_provider(agent)
        if not provider:
            return []
        size = Path(agent.transcript).stat().st_size
    except OSError:
        return []
    held = TURNS.get(agent.transcript)
    if not held or held[0] != size:
        held = TURNS[agent.transcript] = (size, provider.every_turn(Path(agent.transcript), WholeRead.SEARCH))
    return held[1]


def turns(agent) -> list:
    """The turns an agent spoke, read from the saved cursor so a hook never parses the transcript from its first byte."""
    provider = _settled_provider(agent)
    return [t for t in provider.turns(Path(agent.transcript)) if t.has_agent_text] if provider else []


def last_turn(agent):
    provider = _settled_provider(agent)
    if not provider:
        return None
    recent = [t for t in provider.last_turns(agent.transcript) if t.has_agent_text] or turns(agent)
    return recent[-1] if recent else None


def last_text(agent) -> str:
    written = last_turn(agent)
    return written.text if written else ""


def read_transcripts(root: Path) -> None:
    for record in environment_records(root):
        for agent in Agents(record, actor=SYSTEM).rows.standing():
            if agent.status != "stopped" and agent.transcript and agent.provider in PROVIDERS:
                PROVIDERS[agent.provider]().read_ahead(Path(agent.transcript))
