import re

from features import trigger
from features.base import Feature, on
from providers import PROVIDERS

TAGS = ("[!discovery]", "[!correction]", "[!blocked]", "[!info]", "[!reply]")
TAG = re.compile(
    r"^[ \t]*(?:\*\*)?(?:"
    + "|".join(re.escape(tag) for tag in TAGS)
    + r")(?:\*\*)?(?:[ \t]+|$)"
)


def visible(text: str) -> str:
    return TAG.sub("", str(text or ""), count=1)


def last_said(record, agent) -> str:
    provider = PROVIDERS.get(agent.provider)
    if not provider or not agent.transcript:
        return ""
    turns = provider().transcript(agent.transcript)
    said = [t for t in turns if t.who == "agent" and t.text.strip()]
    return said[-1].text if said else ""


class Tags(Feature):
    name = "tags"
    title_ = "Tags"
    abstract_ = "The agent's last message opens with one tag, or it is told so once"
    help_ = " ".join(TAGS)
    trigger = {"on": trigger.IDLE}

    @on("agent.updated")
    def check(self, event, record) -> None:
        agent = self.agent_due(event, record)
        if not agent:
            return
        said = last_said(record, agent)
        if said and not TAG.match(said):
            self.nudge(record, agent, "your last message has no tag", f"open every message with exactly one of {' '.join(TAGS)}")
