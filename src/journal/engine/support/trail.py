from journal.models.agent import Agent
from journal.models.entry import Entry
from journal.support.actor import Actor


class Trail:
    """The record of every change of an agent's stack: an entry of kind state with the stack before and after, what caused it, and a refused push with its line."""

    KIND = "state"

    @staticmethod
    def entry(agent: Agent, after: list[dict], cause: str, actor: Actor, **more) -> Entry:
        data = {"session": agent.session, "before": list(agent.stack), "after": after, "cause": cause, **more}
        return Entry(environment_id=agent.environment_id, kind=Trail.KIND, actor=actor, data=data)
