from dataclasses import dataclass

GIVEN_STATUS = 200
WAITING_STATUS = 202
NOTHING_STATUS = 204
GONE_STATUS = 410


@dataclass(frozen=True)
class WakeReply:
    """The server's answer to a wake hook: a line for the agent, nothing yet, gone (cancelled, replaced or not
    allowed), or, between the route's two steps, a waiter that is registered and waits."""

    status: int
    agent_id: int = 0
    line: str = ""
    line_id: int = 0
    token: str = ""

    @classmethod
    def gone(cls) -> "WakeReply":
        return cls(GONE_STATUS)

    @classmethod
    def nothing(cls) -> "WakeReply":
        return cls(NOTHING_STATUS)

    @classmethod
    def waiting(cls, agent_id: int, token: str) -> "WakeReply":
        return cls(WAITING_STATUS, agent_id, token=token)

    @classmethod
    def given(cls, line: str, line_id: int, token: str) -> "WakeReply":
        return cls(GIVEN_STATUS, line=line, line_id=line_id, token=token)

    @property
    def is_waiting(self) -> bool:
        return self.status == WAITING_STATUS

    def json(self) -> dict[str, object]:
        return {"line": self.line, "line_id": self.line_id, "token": self.token} if self.status == GIVEN_STATUS else {}
