from dataclasses import dataclass
from enum import StrEnum


class WorkState(StrEnum):
    NEEDS = "needs"
    WORKING = "working"
    IDLE = "idle"
    REPORTED = "reported"
    FINISHED = "finished"
    STOPPED = "stopped"
    ENDED = "ended"


@dataclass(frozen=True)
class HelperAgent:
    status: str = ""
    at: float = 0.0
    started: float = 0.0
    tool: str = ""
    file: str = ""

    @classmethod
    def from_payload(cls, payload: dict) -> "HelperAgent":
        return cls(status=payload.get("status", ""), at=float(payload.get("at", 0.0)),
                   started=float(payload.get("started", 0.0)), tool=payload.get("tool", ""), file=payload.get("file", ""))


@dataclass(frozen=True)
class HelperSnapshot:
    name: str = ""
    owner: str = ""
    attention_kind: str = ""
    attention_text: str = ""
    silent: bool = False
    agent: HelperAgent = HelperAgent()
    todo: int = 0

    @classmethod
    def from_payload(cls, payload: dict) -> "HelperSnapshot":
        attention = payload.get("attention") or {}
        agent = payload.get("agent") or {}
        work = payload.get("work") or payload.get("last") or {}
        return cls(name=payload.get("name", ""), owner=payload.get("owner", ""),
                   attention_kind=attention.get("kind", ""), attention_text=attention.get("text", ""),
                   silent=bool(payload.get("silent")), agent=HelperAgent.from_payload(agent), todo=int(work.get("todo", 0)))


def helper_state(row, environment: HelperSnapshot, now: float) -> WorkState:
    if row.completed:
        return WorkState.FINISHED
    if row.report:
        return WorkState.REPORTED
    if environment.attention_kind or environment.silent:
        return WorkState.NEEDS
    if not environment.agent.status or environment.agent.status == "stopped":
        return WorkState.STOPPED if row.stopped_by_user else WorkState.ENDED
    if now - environment.agent.at <= 300:
        return WorkState.WORKING
    return WorkState.IDLE


def asked_permission(environment: HelperSnapshot) -> str:
    return environment.attention_text if environment.attention_kind == "permission" else ""


def helper_reason(environment: HelperSnapshot, now: float) -> str:
    if environment.attention_kind == "question":
        return f"Asks a question: {environment.attention_text}"
    if environment.attention_kind == "permission":
        return f"Wants a permission: {environment.attention_text}"
    if environment.silent:
        return f"Silent for {max(5, int((now - environment.agent.at) / 60))} min"
    return ""
