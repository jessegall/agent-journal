from events.answers import Allowed, Answer, Refused
from events.asking import ToolCallAsked
from framework.loaded import FEATURES
from receiving import Answerer


class RefusePlanMode(Answerer[ToolCallAsked]):
    def answer(self, event: ToolCallAsked) -> Answer:
        if event.subagent or event.tool != "EnterPlanMode":
            return Allowed()
        title, brief = FEATURES["plans"].line("plan mode", {})
        return Refused(f"{title} - {brief}")
