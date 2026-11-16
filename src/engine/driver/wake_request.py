from dataclasses import dataclass

from engine.driver.hook_fields import mapping, text


@dataclass(frozen=True)
class WakeRequest:
    """One ask of an agent program's wake hook: the program, the session it runs, its launch name, and the token that
    names this waiter."""

    program: str
    session: str
    launch: str
    token: str

    @classmethod
    def parsed(cls, data: object) -> "WakeRequest":
        fields = mapping(data, "a wake ask")
        return cls(text(fields, "program"), text(fields, "session"), text(fields, "launch"), text(fields, "token"))
