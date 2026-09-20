import re

from features import trigger
from features.base import Feature, event
from support.transcript import last_said

LISTED = re.compile(r"^\s*(?:\(?[A-Za-z]\)|\(?[A-Za-z][.)]|\d+[.)]|[-*•])\s+\S", re.MULTILINE)
ASKING = re.compile(r"\?|\b(should I|shall I|do you want|would you like|would you prefer|let me know|your call|you decide|up to you)\b", re.IGNORECASE)


NAMED = re.compile(r"\bquestion \d+\b", re.IGNORECASE)


def offers_choices(text: str) -> bool:
    asked = "\n".join(line for line in text.splitlines() if not NAMED.search(line))
    return len(LISTED.findall(text)) >= 2 and bool(ASKING.search(asked))


class Choices(Feature):
    name = "choices"
    title_ = "Options on a question"
    abstract_ = "A message that offers the user choices in prose holds the agent until it asks through a question"
    help_ = "Two or more listed options and a question in the same message: the agent is told to use journal question ask --set options=…; the hold lifts when a question is created. A line that names a question by number points at one already asked and does not count."
    trigger = {"on": trigger.IDLE}

    @event("agent.updated")
    def check(self, event, record) -> None:
        agent = self.agent_due(event, record)
        if not agent:
            return
        if offers_choices(last_said(record, agent)):
            self.nudge(record, agent, "your last message offers choices in prose", "ask through journal question ask \"<one line>\" --set options='[{\"title\": …, \"description\": …}]' --set pick=<n>, so the viewer renders it; your writes wait until you do")
            self.hold(record, "your last message offered the user choices in prose: ask them through journal question ask --set options=… before any other write")

    @event("question.created")
    def asked(self, event, record) -> None:
        self.release(record)
