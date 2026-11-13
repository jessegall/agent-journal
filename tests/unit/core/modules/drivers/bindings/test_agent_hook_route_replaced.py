from types import SimpleNamespace

from core.modules.drivers.bindings.agent_hook_route import AgentHookRoute
from core.modules.drivers.support.access_nudges import REPLACED_SESSION, UNKNOWN_AGENT
from engine.driver.hook_event import HOOK_EVENT_VERSION, HookEvent
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.support.access_nudges import REPLACED_SESSION
from engine.testing.expectations.expect_nudge import said

MAIN_ROW_ID = 7
REPLACED_SESSIONS = {"s-1": MAIN_ROW_ID}


class FakeRows:
    """The agent rows the route reads: one main agent numbered 1, held by session s-2."""

    def session(self, session: str) -> None:
        return None

    def find_unscoped(self, agent_id: int) -> SimpleNamespace:
        return SimpleNamespace(id=agent_id, number=1)


class StartRecorder:
    """Keeps each agent start the route asked for and answers it with the role it named."""

    def __init__(self) -> None:
        self.started_roles: list[str] = []

    def started(self, event: HookEvent, role: str, parent_id: int | None) -> str:
        self.started_roles.append(role)
        return role


def route() -> AgentHookRoute:
    sessions = SimpleNamespace(replaced_agent_id=REPLACED_SESSIONS.get)
    return AgentHookRoute(*[SimpleNamespace()] * 5, FakeRows(), *[SimpleNamespace()] * 6, sessions, SimpleNamespace())


def hook(session: str, event: HookEventName, role: str = "", source: str = "startup") -> HookEvent:
    return HookEvent(HOOK_EVENT_VERSION, "claude", event, session, "firing-1", 0, "agent", "main", None, None, {"source": source}, role=role)


def test_a_tool_of_a_session_in_the_history_that_is_not_current_is_answered_replaced():
    reply = route().agentless_reply(hook("s-1", HookEventName.PRE_TOOL_USE))
    assert reply.refusal == REPLACED_SESSION.nudge(agent=1).text
    assert said(REPLACED_SESSION).is_in(reply.refusal)


def test_another_event_of_a_replaced_session_passes_with_no_refusal():
    assert not route().agentless_reply(hook("s-1", HookEventName.POST_TOOL_USE)).refusal


def test_a_compaction_start_of_a_replaced_session_starts_no_agent():
    recorder = StartRecorder()
    hook_route = route()
    hook_route.started = recorder.started
    assert hook_route.session_agent(hook("s-1", HookEventName.SESSION_START, source="compact")) is None
    assert recorder.started_roles == []


def test_an_unknown_session_of_a_main_starts_as_the_main_agent():
    recorder = StartRecorder()
    hook_route = route()
    hook_route.started = recorder.started
    assert hook_route.session_agent(hook("s-9", HookEventName.SESSION_START)) == AgentRole.MAIN
    assert recorder.started_roles == [AgentRole.MAIN]


def test_a_tool_of_an_unknown_helper_session_is_refused_as_unknown():
    reply = route().agentless_reply(hook("w-9", HookEventName.PRE_TOOL_USE, role="worker"))
    assert reply.refusal == UNKNOWN_AGENT.nudge().text
