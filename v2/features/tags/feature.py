import re

from v2.controllers.types import CONTROLLERS
from v2.features import trigger
from v2.features.base import Feature, on
from v2.providers import PROVIDERS
from v2.resources.base import SYSTEM

TAGS = ("[!discovery]", "[!correction]", "[!blocked]", "[!info]", "[!reply]")
TAG = re.compile(r"^\s*(?:\*\*)?\[!(?:discovery|correction|blocked|info|reply)\]")


def last_said(record, agent) -> str:
    provider = PROVIDERS.get(agent.data.get("provider", ""))
    if not provider or not agent.data.get("transcript"):
        return ""
    turns = provider().transcript(agent.data["transcript"])
    said = [t for t in turns if t.who == "agent"]
    return said[-1].text if said else ""


class Tags(Feature):
    name = "tags"
    title_ = "Tags"
    abstract_ = "The agent's last message opens with one tag, or it is told so once"
    help_ = " ".join(TAGS)
    trigger = {"on": trigger.IDLE}

    @on("agent.updated")
    def check(self, event, record) -> None:
        agent = CONTROLLERS["agent"](record, actor=SYSTEM).load(event.n)
        if not self.due(record, agent):
            return
        said = last_said(record, agent)
        if said and not TAG.match(said):
            self.nudge(record, agent, "your last message has no tag", f"open every message with exactly one of {' '.join(TAGS)}")
