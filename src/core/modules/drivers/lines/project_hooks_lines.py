from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.support.project_hook_answers import MANAGED_HOOKS_KEY, ProjectHookAnswers


class ProjectHooksLines(EventLineSource):
    """The lines of the project's own hooks that are new since each last spoke to the agent, and the line of one that
    refused."""

    key = MANAGED_HOOKS_KEY
    events = [event for event in HookEventName if event is not HookEventName.TICK]

    def __init__(self, answers: ProjectHookAnswers) -> None:
        self.answers = answers

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        if event is None:
            return []
        answer = self.answers.answer(event, agent_id)
        if answer.refusal is None:
            return list(answer.agent_messages)
        return [*answer.agent_messages, answer.refusal]
