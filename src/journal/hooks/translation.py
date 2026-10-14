from journal.events.agent.agent_event import AgentEvent
from journal.hooks.hook import Hook
from journal.hooks.hook_kind import HookKind
from journal.models.environment import Environment


class Translation:
    """Each hook kind to the agent event it means; a table, so no kind is ever read twice in two places."""

    EVENTS: dict[HookKind, type[AgentEvent]]

    def event(self, hook: Hook, environment: Environment) -> AgentEvent: ...
