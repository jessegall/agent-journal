from dataclasses import dataclass

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.record.question import Question


@dataclass(frozen=True)
class PolicyRow:
    """One row of a policy's decision table: what is asked, in which view, and the keys of the refusals it must give, none for allowed."""

    name: str
    question: Question
    view: AgentView
    refusal_keys: tuple[str, ...] = ()
