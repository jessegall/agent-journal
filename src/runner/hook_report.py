import time

from controllers.types import Agents
from engine import bus, command_effects, files, ran
from engine.record import Record
from providers import skill_folders
from providers.base import asking_row
from providers.payload import Hook, HookEvent, HookFacts, LoopCall, LoopEndCall
from resources.base import AGENT, SYSTEM
from resources.types import IDLE


def report(provider, record: Record, hook: Hook) -> None:
    agents = Agents(record, actor=SYSTEM)
    row = agents.by_session(hook.session)
    wrote = hook.event == HookEvent.POST_TOOL_USE and command_effects.writes(hook)
    agents.saw(row.n, {"hook": hook.event, "tool": hook.tool.name, "file": hook.tool.path, "session": hook.session, "size": hook.tool.result_size, "skill": hook.tool.loaded_skill, "cause": AGENT},
               status=provider.status(hook) or row.status or IDLE, **merged(provider, row, hook, provider.facts(hook, record.root)), **command_effects.shell(row, hook), wrote=wrote)
    if hook.event == HookEvent.POST_TOOL_USE:
        bus.defer(lambda: ran.tool_ran(record, row.n, hook.tool))
    if wrote:
        bus.defer(lambda: files.announce_writes(record, row.n, skill_folders()))


def merged(provider, row, hook: Hook, facts: HookFacts) -> dict:
    return {"event": facts.event, "tool": facts.tool, **facts.transcript_facts, "file": facts.file, "cwd": facts.cwd or row.cwd or "", "at": time.time(),
            "provider": provider.name, "uses": int(row.uses) + (hook.event == HookEvent.PRE_TOOL_USE), "transcript": facts.transcript or row.transcript,
            "inbox": facts.inbox or row.inbox or "", "model": facts.model or row.model or "", "effort": facts.effort, "started": row.started or time.time(),
            "context": row.context or 0 if facts.context is None else facts.context, "asking": asking_row(facts.asking),
            "last_message": facts.last_message or row.last_message or "", "loops": loops_after(row, hook), "prompted": facts.prompted or row.prompted}


def loops_after(row, hook: Hook) -> dict:
    kept, call = dict(row.loops or {}), hook.tool
    if hook.event == HookEvent.POST_TOOL_USE and isinstance(call, LoopCall) and call.loop:
        kept[call.loop] = {"schedule": call.schedule, "prompt": call.prompt, "at": time.time()}
    if hook.event == HookEvent.POST_TOOL_USE and isinstance(call, LoopEndCall):
        kept.pop(call.loop, None)
    return kept
