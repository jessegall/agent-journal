from journal.engine.conduct import Conduct
from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.idle import Idle
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.tool_starting import ToolStarting
from journal.features.skills.support.skill_card import SkillCard


class SkillsConduct(Conduct):
    """The skills feature's conduct in every state: a session starts owing the journal skill and the state's own, a prompt that names a skill's keyword owes that skill, a write while a skill is owed is held until its file is read, and so is a stop."""

    def on_session_started_skills(self, event: SessionStarted, settings: Settings) -> Transition:
        return self.unchanged(*read_first(event.snapshot.of(skills_feature()).due_at_start(self.name)))

    def on_prompt_submitted_skills(self, event: PromptSubmitted, settings: Settings) -> Transition:
        return self.unchanged(*read_first(event.snapshot.of(skills_feature()).named_in(event.prompt)))

    def on_tool_starting_skills(self, event: ToolStarting, settings: Settings) -> Transition:
        owed = event.snapshot.of(skills_feature()).owed_cards()
        if event.subagent or not event.call.writes or not owed:
            return self.unchanged()
        return self.hold(read_first(owed)[0])

    def on_idle_skills(self, event: Idle, settings: Settings) -> Transition:
        owed = event.snapshot.of(skills_feature()).owed
        return self.hold(skills_feature().STOPPED_OWING.create(skills=" and ".join(owed))) if owed else self.unchanged()


def skills_feature():
    from journal.features.skills.feature import Skills
    return Skills


def read_first(cards: list[SkillCard]) -> list[Nudge]:
    return [skills_feature().READ_THE_SKILL_FIRST.create(skill=card.name, path=card.path) for card in cards]
