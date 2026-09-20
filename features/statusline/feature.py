from controllers.types import Agents
from features.base import Behaviour, Feature, event
from features.statusline.group import grouped, ran
from features.statusline.queue import queue
from features.statusline.usage import observe
from resources.base import SYSTEM


def bar(row, now: float = 0.0) -> dict:
    return {"queue": queue(grouped(ran(row.commands)), now)}


class StatusLine(Feature):
    name = "statusline"
    title_ = "The status bar"
    abstract_ = "The journal says what the bar shows — what the agent is running, and how much of its plan is left — and the viewer renders it"
    help_ = "Four stages, one after the other: the provider records every command that runs on the agent's ring; dissect takes one apart into its kind and the names it worked on; group joins consecutive commands of the same kind; queue turns each group into a status message with its verb, its rolling parts, its counts and how long it stays. The viewer plays the queue and decides nothing of its own. Plan usage is read through the provider for the session bar; providers without accessible data explain their native source."
    aliases = (("usage", "usage"),)
    behaviours = {"usage": Behaviour("Show how much of the plan is left", "The provider's plan windows, read from the live CLI")}

    @event("agent.updated")
    def refresh(self, event, record) -> None:
        if not self.on(record, "usage"):
            return
        agent = self.agent(event, record)
        usage = observe(agent.provider, agent.transcript, agent.usage)
        if usage is not None and usage != agent.usage:
            Agents(record, actor=SYSTEM).update(agent.n, usage=usage)
