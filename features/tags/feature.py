import re

from features import trigger
from features.base import Feature, chatformatter, event
from support.transcript import last_said

TAGS = ("[!discovery]", "[!correction]", "[!blocked]", "[!info]", "[!reply]")
TAG = re.compile(
    r"^[ \t]*(> ?)?(?:\*\*)?(?:"
    + "|".join(re.escape(tag) for tag in TAGS)
    + r")(?:\*\*)?(?:[ \t]+|$)", re.M
)


def visible(text: str) -> str:
    return TAG.sub(lambda found: found.group(1) or "", str(text or ""))


class Tags(Feature):
    name = "tags"
    title_ = "Tagging"
    abstract_ = "The agent's last message opens with one tag, or it is told so at the end of the turn"
    help_ = " ".join(TAGS)
    trigger = {"on": trigger.IDLE}

    @event("agent.updated")
    def check(self, event, record) -> None:
        agent = self.agent_due(event, record)
        if not agent:
            return
        said = last_said(record, agent)
        if said and not TAG.match(said):
            self.nudge(record, agent, "your last message has no tag", f"open every message with exactly one of {' '.join(TAGS)}")

    @chatformatter
    def without_tags(self, text, record):
        return visible(text)
