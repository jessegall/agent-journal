from dataclasses import dataclass


@dataclass(frozen=True)
class SampleAgent:
    # @righteous architecture_drivers_agent_keeps_a_stack
    session: str
    # @sin architecture_drivers_agent_keeps_a_stack
    stack: tuple[str, ...] = ()
