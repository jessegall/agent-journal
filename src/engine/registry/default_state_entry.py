from dataclasses import dataclass

from engine.enums.agent_kind import AgentKind


@dataclass(frozen=True)
class DefaultStateEntry:
    """A registered default state of a suite: the state's name, the kind of agent fact it is given by, the value of
    that fact, and the state that takes it away while open."""

    state: str
    kind: AgentKind
    value: str
    removed_while: str = ""

    def matches(self, role: str, driver: str, helper_type: str) -> bool:
        return self.value == {AgentKind.ROLE: role, AgentKind.DRIVER: driver, AgentKind.HELPER_TYPE: helper_type}[self.kind]
