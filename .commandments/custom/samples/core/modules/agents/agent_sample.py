from dataclasses import dataclass


@dataclass(frozen=True)
class SampleAgent:
    # @righteous architecture_drivers_AgentKeepsNoStackDetector
    session: str
    # @sin architecture_drivers_AgentKeepsNoStackDetector
    stack: tuple[str, ...] = ()
