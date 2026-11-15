from dataclasses import dataclass

from engine.driver.hook_event import HookEvent


@dataclass(frozen=True)
class EventIdentity:
    """Whose event a decision record answers: the program, session and firing of the hook, and the agent with
    its type and profile."""

    program: str
    session: str
    session_number: int
    event_id: str
    agent_id: int
    environment_id: int
    agent_type: str
    profile: str
    driver_name: str
    child_agent: str = ""

    @classmethod
    def identified(cls, event: HookEvent, session_number: int, agent_id: int, environment_id: int, agent_type: str, profile: str, driver_name: str) -> "EventIdentity":
        return cls(event.program, event.session, session_number, event.event_id, agent_id, environment_id, agent_type, profile, driver_name,
                   event.child_agent)
