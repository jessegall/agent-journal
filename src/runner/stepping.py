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


def rewrite(provider, root: Path, env: str, hook: Hook) -> dict:
    """The answer that runs a chained Bash command part by part, each part reporting when it starts and ends, or nothing when the command cannot be cut with certainty."""
    tool = hook.tool
    chain = chain_of(tool.command) if isinstance(tool, BashCall) else None
    if chain is None:
        return {}
    token = re.sub(r"\W", "", hook.tool_use) or uuid.uuid4().hex
    answer = provider.rewritten(hook, chain.stepped(token, str(runtime.folder(root) / "heartbeat")))
    if answer:
        write_json(file_of(root, token), SteppedCall(hook.session, env, tool.command, chain.parts).to_json())
    return answer


def combined(answer: dict, rewritten: dict) -> dict:
    """The answer the gates gave with the rewrite folded into its hook output."""
    if not rewritten:
        return answer
    return {**answer, "hookSpecificOutput": {**(answer.get("hookSpecificOutput") or {}), **rewritten["hookSpecificOutput"]}}


def report_step(root: Path, call: SteppedCall, part: int, phase: str, status: int) -> None:
    """A part of a stepped call started or ended: the agent's row names the part now running, and a part that ended well is a command that ran."""
    record = Record(root, call.env)
    agents = Agents(record, actor=SYSTEM)
    row = agents.by_session(call.session)
    command = call.parts[part - 1]
    if phase == START:
        agents.update(row.n, step={"command": command, "at": time.time()})
        return
    agents.update(row.n, step={})
    if status == 0:
        ran.announce(record, row.n, ran.STEP, command)
