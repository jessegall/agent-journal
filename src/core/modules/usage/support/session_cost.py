from dataclasses import dataclass


@dataclass(frozen=True)
class SessionCost:
    """What one session of an agent cost, with the program it ran on; no dollars when it reported no cost."""

    session: str
    program: str
    dollars: float | None

    def json(self) -> dict[str, object]:
        return {"session": self.session, "program": self.program, "cost_dollars": self.dollars}
