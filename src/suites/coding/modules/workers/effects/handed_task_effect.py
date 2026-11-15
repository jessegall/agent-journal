from collections.abc import Sequence

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.effect import Effect
from engine.agent_machine.decision_record import DecisionRecord
from engine.agent_stack.states.working import Working
from engine.command.command import Command
from engine.enums.effect_timing import EffectTiming
from engine.enums.hook_event_name import HookEventName
from engine.enums.work_type import WorkType
from core.modules.tasks.commands.assign_next_task.assign_next_task import AssignNextTask
from suites.coding.modules.workers.needs.main_stop_needs import MAIN_STOP_KEY


class HandedTaskEffect(Effect):
    """The always-effect of a step that sees Working(handed task): the main agent's next task is started through
    AssignNextTask in the step's own save, at a stop and off a hook (doc 1310 section 4.11)."""

    events = [HookEventName.STOP]
    includes_steps = True
    agent_types = ["main"]
    timing = EffectTiming.UNCONDITIONAL

    def commands(self, view: AgentView, record: DecisionRecord) -> Sequence[Command[object]]:
        handed = any(isinstance(need.state, Working) and need.state.work.work_type is WorkType.HANDED_TASK for need in view.needs)
        return [AssignNextTask(view.agent.agent_id)] if handed else []
