from controllers.types import Agents
from features.base import Feature, event
from resources.base import SYSTEM

from .usage import observe


class Usage(Feature):
    name = "usage"
    title_ = "Plan usage"
    abstract_ = "The session bar shows authenticated plan windows reported by the live CLI"
    help_ = "Always on: plan usage is read through the provider; providers without accessible data explain their native source."
    fixed = True

    @event("agent.updated")
    def refresh(self, event, record) -> None:
        agent = self.agent(event, record)
        usage = observe(agent.provider, agent.transcript, agent.usage)
        if usage is not None and usage != agent.usage:
            Agents(record, actor=SYSTEM).update(agent.n, usage=usage)
