from dataclasses import fields

from journal.engine.agent_state import AgentState
from journal.engine.states.paused import Paused

ENTERED_BY = {
    "working": "starting a task",
    "following_plan": "starting a plan",
    "waiting": "asking a question",
    "awaiting": "dispatching a worker",
    "running_sequence": "the start sequence action",
}


class Moves:
    """Which states a workflow's move may enter: idle, and a wait that holds nothing but words, expecting and stuck, laid over what the agent is doing; the rest are entered by what makes their rows, or by the engine."""

    @staticmethod
    def words_field(target: AgentState) -> str:
        """The one field of words a wait carries, when the wait is one a workflow may make; empty for every other state."""
        if not isinstance(target, Paused) or target.owed_by_agent:
            return ""
        own = [f for f in fields(target) if f.name != "resume"]
        return own[0].name if len(own) == 1 and own[0].type in (str, "str") else ""

    @staticmethod
    def refusal(name: str) -> str:
        made = ENTERED_BY.get(name, "the engine")
        return f"a workflow moves the agent to idle, or into expecting or stuck over what it is doing; {name} is entered by {made}"
