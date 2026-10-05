from pathlib import Path

from agents.seat import HookBinding
from controllers.types import Agents
from engine import bus, runtime
from engine.gates import HookCall, responded
from engine.record import Record
from providers.base import asking_row
from providers.payload import PERMISSION, STATUS, Hook, HookEvent
from resources.base import SYSTEM
from resources.types import AgentRow
from runner import chat_mirror
from runner.gate import refusal
from runner.hook_report import report


def answer(provider, root: Path, raw: dict, pid: int, prefer: str = "") -> dict:
    hook = Hook.read(raw, provider.tool_kinds)
    return handle(provider, root, HookBinding(root, provider, pid).environment(hook, prefer), hook)


def handle(provider, root: Path, env: str, hook) -> dict:
    hook = Hook.read(hook, provider.tool_kinds) if isinstance(hook, dict) else hook
    if hook.event not in STATUS or runtime.off(root):
        return {}
    record = Record(root, env, memo=True)
    if provider.is_subagent(hook):
        return subagent_answer(provider, record, hook)
    report(provider, record, hook)
    call = HookCall(provider, record, hook, Agents(record, actor=SYSTEM)._shared(hook.session))
    return ANSWERS.get(hook.event, quiet)(call)


def subagent_answer(provider, record: Record, hook: Hook) -> dict:
    agents = Agents(record, actor=SYSTEM)
    row = agents.by_session(hook.session)
    parent = provider.session(hook.transcript).get(AgentRow.parent, "") if not row.parent else ""
    if parent:
        row = agents.update(row.n, parent=parent)
    if hook.event == PERMISSION or row.asking:
        agents.update(row.n, asking=asking_row(provider.asking(hook)))
    if hook.event != HookEvent.PRE_TOOL_USE:
        return {}
    return refused(HookCall(provider, record, hook, agents._shared(hook.session)))


def quiet(call: HookCall) -> dict:
    return {}


def refused(call: HookCall) -> dict:
    why = refusal(call)
    return {} if why is None else call.provider.blocking(why)


def started(call: HookCall) -> dict:
    return call.provider.response(call.hook.event, responded(call))


def ended(call: HookCall) -> dict:
    bus.defer(lambda: chat_mirror.turn_ended(call.record.root, call.session, call.row, call.hook.last_message))
    return {}


def prompted(call: HookCall) -> dict:
    bus.defer(lambda: chat_mirror.turn_began(call.record.root, call.session, call.row))
    return {}


ANSWERS = {HookEvent.PRE_TOOL_USE: refused, HookEvent.SESSION_START: started, HookEvent.STOP: ended, HookEvent.USER_PROMPT_SUBMIT: prompted}
