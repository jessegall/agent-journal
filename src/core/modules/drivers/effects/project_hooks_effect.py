from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.support.project_hook_answers import MANAGED_HOOKS_KEY, ProjectHookAnswers


class ProjectHooksEffect(EventEffect):
    """Records the project hooks' lines and refusals as notices of the agent."""

    key = MANAGED_HOOKS_KEY
    events = [event for event in HookEventName if event is not HookEventName.TICK]

    def __init__(self, answers: ProjectHookAnswers) -> None:
        self.answers = answers

    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        return self.answers.answer(event, agent_id).commands if event is not None else []
