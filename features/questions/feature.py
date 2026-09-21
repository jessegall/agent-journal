import re

from features import trigger
from features.base import Behaviour, Feature, event
from engine.transcript import last_said

LISTED = re.compile(r"^\s*(?:\(?[A-Za-z]\)|\(?[A-Za-z][.)]|\d+[.)]|[-*•])\s+\S", re.MULTILINE)
ASKING = re.compile(r"\?|\b(should I|shall I|do you want|would you like|would you prefer|which would you rather|let me know|your call|you decide|up to you"
                    r"|one thing I need from you|one question for you|the one decision|I would want your call|your pick)\b", re.IGNORECASE)
NAMED = re.compile(r"\bquestion \d+\b", re.IGNORECASE)


def offers_choices(text: str) -> bool:
    asked = "\n".join(line for line in text.splitlines() if not NAMED.search(line))
    return len(LISTED.findall(text)) >= 2 and bool(ASKING.search(asked))


class Questions(Feature):
    name = "questions"
    title_ = "Questions"
    abstract_ = "A decision only the user can make is asked as a question, never offered in prose, and the answer they pick is held for a moment before it is saved"
    help_ = ("A question or a suggestion is answered by clicking a choice; the choice is held for a moment before it is saved, and clicking it again in that moment takes it back. "
             "questions.hold sets the moment in seconds, three by default. "
             "A message with two or more listed options and a question, or the language of putting a decision to the user, tells the agent to use journal question ask --set options=…; "
             "its writes wait until a question is created. A line naming a question by number points at one already asked and does not count.")
    fixed = True
    hold_for = 3
    aliases = (("choices", "asking"),)
    behaviours = {"asking": Behaviour("Ask through a question, not in prose",
                                      "Choices offered in a message hold the writes until they are asked as a question",
                                      trigger={"on": trigger.IDLE})}

    def settings_view(self, record) -> dict:
        return {"hold": self.held_for(record)}

    def held_for(self, record) -> float:
        return float(record.questions.get("hold", self.hold_for))

    @event("agent.updated")
    def check(self, event, record) -> None:
        agent = self.agent(event, record)
        if not agent or not self.due(record, agent, "asking") or not offers_choices(last_said(record, agent)):
            return
        self.nudge(record, agent, "your last message offers choices in prose",
                   "ask through journal question ask \"<one line>\" --set options='[{\"title\": …, \"description\": …}]' --set pick=<n>, so the viewer renders it; your writes wait until you do")
        self.hold(record, "your last message offered the user choices in prose: ask them through journal question ask --set options=… before any other write", "asking")

    @event("question.created")
    def asked(self, event, record) -> None:
        self.release(record, "asking")
