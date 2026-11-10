from dataclasses import dataclass


@dataclass(frozen=True)
class SessionCost:
    """What one session of an agent cost, with the program it ran on."""

    session: str
    program: str
    dollars: float

    def json(self) -> dict[str, object]:
        return {"session": self.session, "program": self.program, "cost_dollars": self.dollars}
