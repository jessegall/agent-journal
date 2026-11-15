from collections.abc import Sequence

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.effect import Effect
from engine.agent_machine.decision_record import DecisionRecord
from engine.agent_stack.states.working import Working
from engine.command.command import Command
from engine.enums.effect_timing import EffectTiming
from engine.enums.hook_event_name import HookEventName
from engine.enums.work_type import WorkType
from core.modules.tasks.commands.start_task.start_task import StartTask


class HandedTaskEffect(Effect):
    """The always-effect of a step that sees Working(handed task): the task handed to the main agent is started in
    the step's own save, at a stop and off a hook, whether auto mode is on or a task was reserved for the agent
    (doc 1310 section 4.11)."""

    events = [HookEventName.STOP]
    includes_steps = True
    agent_types = ["main"]
    timing = EffectTiming.UNCONDITIONAL

    def commands(self, view: AgentView, record: DecisionRecord) -> Sequence[Command[object]]:
        handed = [need.state.work.work_id for need in view.needs if isinstance(need.state, Working) and need.state.work.work_type is WorkType.HANDED_TASK]
        return [StartTask(task_id) for task_id in handed[:1]]
