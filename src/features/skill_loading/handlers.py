from events import Fact
from events.skill_loading import JournalSkillMissing, RefusalCounted, SessionOwesSkills, SkillLoaded, SkillsOwed, StaleSkillsNamed, WindowOpened, WindowUpgraded
from features.skill_loading.answering import REFUSED, next_count
from features.skill_loading.listeners import NAME
from features.skill_loading.required import require, require_only
from receiving import Handler
from resources.types import AgentRow
from serving import Chat, Elsewhere, Marks, Rows, Settings

KEPT_LOADS = 50


class OpenWindow(Handler[WindowOpened]):
    def handle(self, event: WindowOpened, marks: Marks) -> list[Fact]:
        marks.write(NAME, notified=False, uses=event.uses, context=event.context, since=event.at)
        return []


class UpgradeWindow(Handler[WindowUpgraded]):
    def handle(self, event: WindowUpgraded, marks: Marks) -> list[Fact]:
        marks.write(NAME, notified=True)
        return []


class NameUnloaded(Handler[JournalSkillMissing]):
    def handle(self, event: JournalSkillMissing, chat: Chat, marks: Marks) -> list[Fact]:
        chat.nudge("unloaded")
        marks.write(NAME, notified=True)
        return []


class OweSkills(Handler[SkillsOwed]):
    def handle(self, event: SkillsOwed, elsewhere: Elsewhere) -> list[Fact]:
        require(elsewhere.here().record, event.session, dict(event.skills))
        return []


class OweSessionSkills(Handler[SessionOwesSkills]):
    def handle(self, event: SessionOwesSkills, elsewhere: Elsewhere, marks: Marks) -> list[Fact]:
        require_only(elsewhere.here().record, event.session, dict(event.skills))
        marks.write(REFUSED, count=0)
        return []


class NameStaleSkills(Handler[StaleSkillsNamed]):
    def handle(self, event: StaleSkillsNamed, chat: Chat) -> list[Fact]:
        chat.nudge("stale", skills=event.skills)
        return []


class ShowSkillLoad(Handler[SkillLoaded]):
    def handle(self, event: SkillLoaded, agents: Rows[AgentRow]) -> list[Fact]:
        loads = [*(agents.load(event.agent).data.get(AgentRow.skill_loads) or []), {"skill": event.skill, "at": event.at}]
        agents.update(event.agent, **{AgentRow.skill_loads: loads[-KEPT_LOADS:]})
        return []


class KeepRefusalCount(Handler[RefusalCounted]):
    def handle(self, event: RefusalCounted, marks: Marks, settings: Settings) -> list[Fact]:
        count = next_count(marks.last(REFUSED).count, event.wanted, max(0, int(settings.most_refusals)), max(0, int(settings.steps_aside)))
        marks.write(REFUSED, count=count)
        return []
