from core.base.driver.agent_hook import AgentHook
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.support.skill_nudges import SKILL_TOOL_USES


class SkillCountdown:
    """The tool uses left before a due skill is held: three from the moment it became due. Both skill rules ask
    for it on one hook, so the count is read once for that hook."""

    def __init__(self, hook_calls: HookCallQuery) -> None:
        self.hook_calls = hook_calls
        self.last: tuple[object, str, int] | None = None

    def remaining(self, hook: AgentHook, due: AgentSkill) -> int:
        due_at = due.update_timestamp()
        last = self.last
        if last is not None and last[0] is hook.event and last[1] == due_at.text:
            return last[2]
        remaining = SKILL_TOOL_USES - self.hook_calls.tool_call_count(hook.agent_id, due_at)
        self.last = (hook.event, due_at.text, remaining)
        return remaining
