import re
import time
import uuid
from pathlib import Path

from controllers.types import Agents
from engine import ran, runtime
from engine.record import Record
from engine.stepped import SteppedCall, file_of
from engine.stored import write_json
from providers.payload import BashCall, Hook
from providers.steps import chain_of
from resources.base import SYSTEM

START = "start"
ENDED: dict[str, None] = {}
ENDED_KEPT = 500


def rewrite(provider, root: Path, env: str, hook: Hook, answered: dict) -> dict:
    """The answer that runs a chained Bash command part by part, each part reporting when it starts and ends, or the answer as it was when the command cannot be cut with certainty."""
    tool = hook.tool
    chain = chain_of(tool.command) if isinstance(tool, BashCall) else None
    if chain is None:
        return answered
    token = re.sub(r"\W", "", hook.tool_use) or uuid.uuid4().hex
    rewritten = provider.rewritten(hook, chain.stepped(token, str(runtime.folder(root) / "heartbeat")), answered)
    if rewritten is not answered:
        write_json(file_of(root, token), SteppedCall(hook.session, env, tool.command, chain.parts).to_json())
    return rewritten


def report_step(root: Path, call: SteppedCall, part: int, phase: str, status: int, token: str = "") -> None:
    """A part of a stepped call started or ended: the agent's row names the part now running, and a part that ended well is a command that ran.
    The parts report in the background, so an end can arrive before its start: a start that comes after its end is never shown, and an end clears only the part it names."""
    record = Record(root, call.env)
    agents = Agents(record, actor=SYSTEM)
    row = agents.by_session(call.session)
    command = call.parts[part - 1]
    key = f"{token}:{part}" if token else ""
    if phase == START:
        if key in ENDED:
            return
        agents.update(row.n, step={"command": command, "at": time.time(), "key": key})
        return
    if key:
        ENDED[key] = None
        for old in list(ENDED)[:max(0, len(ENDED) - ENDED_KEPT)]:
            del ENDED[old]
    if not key or not row.step or row.step.get("key", key) == key:
        agents.update(row.n, step={})
    if status == 0:
        ran.announce(record, row.n, ran.STEP, command)
