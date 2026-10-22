from journal.models.agent import Agent
from journal.models.entry import Entry
from journal.support.actor import Actor


class StackHistory:
    """The record of every change of an agent's stack: an entry of kind state with the stack before and after, what caused it, and a refused push with its line."""

    KIND = "state"

    @staticmethod
    def entry(agent: Agent, following: list[dict], cause: str, actor: Actor, **extra) -> Entry:
        data = {"session": agent.session, "before": list(agent.stack), "after": following, "cause": cause, **extra}
        return Entry(environment_id=agent.environment_id, kind=StackHistory.KIND, actor=actor, data=data)
