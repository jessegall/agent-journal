from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.support.project_hook_answers import MANAGED_HOOKS_KEY, ProjectHookAnswers


class ProjectHooksPolicy(EventPolicy):
    """A hook a project's own hook refused is refused, naming the agent."""

    key = MANAGED_HOOKS_KEY
    rank = "drivers.policies"
    events = list(HookEventName)
    judges_stops = True

    def __init__(self, answers: ProjectHookAnswers) -> None:
        self.answers = answers

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        return self.answers.answer(event, agent_id).refusal
