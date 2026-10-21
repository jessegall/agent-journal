from journal.engine.conduct import Conduct
from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.stop import Stop
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.tool_starting import ToolStarting
from journal.features.skills.support.skill_card import SkillCard
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from journal.features.skills.feature import Skills


class SkillsConduct(Conduct):
    """The skills feature's conduct in every state: a session starts owing the journal skill and the state's own, a prompt that names a skill's keyword owes that skill, a write while a skill is owed is held until its file is read, and so is a stop."""

    def on_session_started(self, event: SessionStarted, settings: Settings) -> Transition:
        return self.none(*read_first(event.data.part(skills_feature()).start_debts(self.name)))

    def on_prompt_submitted(self, event: PromptSubmitted, settings: Settings) -> Transition:
        return self.none(*read_first(event.data.part(skills_feature()).mentioned(event.prompt)))

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        obligations = event.data.part(skills_feature()).debt_cards()
        if event.subagent or not event.call.writes or not obligations:
            return self.none()
        return self.refuse(read_first(obligations)[0])

    def on_stop(self, event: Stop, settings: Settings) -> Transition:
        obligations = event.data.part(skills_feature()).skills_due
        return self.refuse(skills_feature().UNREAD_SKILL_STOP.create(skills=" and ".join(obligations))) if obligations else self.none()


def skills_feature() -> "type[Skills]":
    from journal.features.skills.feature import Skills
    return Skills


def read_first(cards: list[SkillCard]) -> list[Nudge]:
    return [skills_feature().SKILL_READ_REQUEST.create(skill=card.name, path=card.path) for card in cards]
