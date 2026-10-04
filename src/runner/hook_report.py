from controllers.types import Agents
from engine import bus, command_effects, files, ran
from engine.record import Record
from providers import skill_folders
from providers.payload import Hook, HookEvent
from resources.base import AGENT, SYSTEM
from resources.types import IDLE


def report(provider, record: Record, hook: Hook) -> None:
    agents = Agents(record, actor=SYSTEM)
    row = agents.by_session(hook.session)
    wrote = hook.event == HookEvent.POST_TOOL_USE and command_effects.writes(hook)
    agents.saw(row.n, {"hook": hook.event, "tool": hook.tool.name, "file": hook.tool.path, "session": hook.session, "size": hook.tool.result_size, "skill": hook.tool.loaded_skill, "cause": AGENT},
               status=provider.status(hook) or row.status or IDLE, **provider.facts(row, hook, record.root), **command_effects.shell(row, hook), wrote=wrote)
    if hook.event == HookEvent.POST_TOOL_USE:
        bus.defer(lambda: ran.tool_ran(record, row.n, hook.tool))
    if wrote:
        bus.defer(lambda: files.announce_writes(record, row.n, skill_folders()))
