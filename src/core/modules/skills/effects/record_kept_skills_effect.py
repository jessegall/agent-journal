from collections.abc import Sequence

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.effect import Effect
from engine.agent_machine.decision_record import DecisionRecord
from engine.command.command import Command
from engine.enums.effect_timing import EffectTiming
from engine.enums.hook_event_name import HookEventName
from core.modules.skills.commands.record_kept_skills.record_kept_skills import RecordKeptSkills


class RecordKeptSkillsEffect(Effect):
    """After a tool use, records the skills the program put back into the agent's context, in the save of the step."""
    events = [HookEventName.POST_TOOL_USE]
    timing = EffectTiming.UNCONDITIONAL

    def commands(self, view: AgentView, record: DecisionRecord) -> Sequence[Command[object]]:
        event = record.action.event
        if event is None:
            return []
        transcript = event.transcript
        return [RecordKeptSkills(view.agent.agent_id, transcript.program, transcript.firing, transcript.text)]
