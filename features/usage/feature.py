from controllers.types import Agents
from features.base import Feature, on
from resources.base import SYSTEM

from .usage import observe


class Usage(Feature):
    name = "usage"
    title_ = "Provider plan usage"
    abstract_ = "The session bar shows authenticated plan windows reported by the live CLI"
    help_ = "Always on: Codex usage is read from its transcript; providers without accessible data explain their native source."
    fixed = True

    @on("agent.updated")
    def refresh(self, event, record) -> None:
        agent = self.agent(event, record)
        usage = observe(agent.provider, agent.transcript, agent.usage)
        if usage is not None and usage != agent.usage:
            Agents(record, actor=SYSTEM).update(agent.n, usage=usage)
