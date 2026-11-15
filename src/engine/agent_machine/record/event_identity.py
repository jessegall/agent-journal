from dataclasses import dataclass

from engine.driver.hook_event import HookEvent


@dataclass(frozen=True)
class EventIdentity:
    """Whose event a decision record answers: the program, session and firing of the hook, and the agent with
    its type, profile and pin."""

    program: str
    session: str
    session_generation: int
    firing: str
    agent_id: int
    environment_id: int
    agent_type: str
    profile: str
    driver_name: str
    pinned_slices: tuple[str, ...]
    child_agent: str = ""

    @classmethod
    def identified(cls, event: HookEvent, session_generation: int, agent_id: int, environment_id: int, agent_type: str, profile: str, driver_name: str,
                   pinned_slices: tuple[str, ...]) -> "EventIdentity":
        return cls(event.program, event.session, session_generation, event.firing, agent_id, environment_id, agent_type, profile, driver_name,
                   pinned_slices, event.child_agent)
