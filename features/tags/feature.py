import re

from features import trigger
from features.base import Behaviour, Feature, event, textformatter
from support.transcript import last_said

TAGS = ("discovery", "correction", "blocked", "info", "reply")


def written(names) -> list[str]:
    return [f"[!{name}]" for name in names]


def pattern(names) -> re.Pattern:
    return re.compile(r"^[ \t]*(> ?)?(?:\*\*)?\[!(?:"
                      + "|".join(re.escape(name) for name in names)
                      + r")(?::[^\]\s]+)?\](?:\*\*)?(?:[ \t]+|$)", re.M)


ANY = pattern(TAGS)


def visible(text: str) -> str:
    return ANY.sub(lambda found: found.group(1) or "", str(text or ""))


class Tags(Feature):
    name = "tags"
    title_ = "Tagging"
    abstract_ = "The agent's last message opens with one tag, or it is told so at the end of the turn"
    help_ = "The tags are settings: tags.names lists them, and a tag is written [!name] at the start of a message."
    behaviours = {"naming": Behaviour("Name a message that opens without a tag",
                                      "Said at the end of the turn, every turn, until one is used",
                                      trigger={"on": trigger.IDLE})}
    NAMES = "names"

    def names(self, record) -> list[str]:
        return [str(name).strip().lstrip("[!").rstrip("]") for name in record.setting(self.name, {}).get(self.NAMES, TAGS) if str(name).strip()] or list(TAGS)

    def reader(self, record) -> re.Pattern:
        return pattern(self.names(record))

    @event("agent.updated")
    def check(self, event, record) -> None:
        agent = self.agent(event, record)
        if not self.due(record, agent, "naming"):
            return
        said = last_said(record, agent)
        if said and not self.reader(record).match(said):
            self.nudge(record, agent, "your last message has no tag",
                       f"open every message with exactly one of {' '.join(written(self.names(record)))}")

    @textformatter
    def without_tags(self, text, record):
        return (self.reader(record) if record else ANY).sub(lambda found: found.group(1) or "", str(text or ""))
