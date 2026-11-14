from collections.abc import Sequence

from engine.command.command import Command
from engine.driver.deferred_rule import DeferredRule
from engine.driver.hook_call_like import HookCallLike
from engine.enums.hook_event_name import HookEventName
from core.modules.skills.commands.record_kept_skills.record_kept_skills import RecordKeptSkills


class RecordKeptSkillsRule(DeferredRule):
    """After a tool use, hands back the one command that records the skills the program put back into the context."""

    name = "skills.record-kept"
    hook = HookEventName.POST_TOOL_USE

    def after(self, call: HookCallLike) -> Sequence[Command[object]]:
        transcript = call.transcript
        return [RecordKeptSkills(call.session_agent_id, transcript.program, transcript.firing, transcript.text)]
