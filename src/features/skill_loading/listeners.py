from engine.journal_calls import calls
from events import Fact
from events.agents import AgentReported, SessionStarted, ToolCallAnswered, ToolFinished
from events.messages import MessageCreated
from events.skill_loading import JournalSkillMissing, RefusalCounted, SessionOwesSkills, SkillLoaded, SkillsOwed, StaleSkillsNamed, WindowOpened, WindowSpent
from features.skill_loading.answering import NAME, asks_for_a_load, refusal_wanted, skill_not_loaded
from features.skill_loading.catalogue import SKILL, catalogue, chosen, loaded_at, loaded_before_compaction, recent_before_compaction, skills, teaching_command
from features.skill_loading.required import named_skills
from payload import HookEvent
from receiving import Listener
from resources.base import USER
from resources.types import AgentRow, Message
from serving import Clock, Providers, ReadElsewhere, ReadMarks, ReadRows, Settings

WINDOWS = (HookEvent.SESSION_START, HookEvent.PRE_COMPACT)


def journal_skill(name: str) -> bool:
    return name == "journal" or name.startswith("journal-")


def owed(agent: AgentRow, skills: dict[str, float]) -> list[Fact]:
    return [SkillsOwed(agent=agent.n, session=agent.title, skills=tuple(skills.items()))] if skills else []


class SpotUnloadedWindow(Listener[AgentReported]):
    def listen(self, event: AgentReported, agents: ReadRows[AgentRow], marks: ReadMarks, clock: Clock) -> list[Fact]:
        row, state = agents.peek(event.agent), marks.last(NAME)
        if row.event in WINDOWS and state.event != row.event:
            opened, notified = [WindowOpened(agent=row.n, uses=row.uses, context=row.context, at=clock.now())], False
        elif state.notified is None and state.at:
            opened, notified = [WindowSpent(agent=row.n)], True
        else:
            opened, notified = [], state.notified
        if notified:
            return opened
        loaded = any(journal_skill(skill) for skill in row.skills)
        return [*opened, (WindowSpent if loaded else JournalSkillMissing)(agent=row.n).due()]


class SpotReload(Listener[AgentReported]):
    def listen(self, event: AgentReported, agents: ReadRows[AgentRow], marks: ReadMarks, settings: Settings, providers: Providers) -> list[Fact]:
        row, since = agents.peek(event.agent), marks.last(NAME).since
        if not settings.is_on("reload") or not since or not providers.offers(row.provider) or not row.transcript:
            return []
        return owed(row, {"journal": since})


class SpotStaleSkills(Listener[AgentReported]):
    def listen(self, event: AgentReported, agents: ReadRows[AgentRow], settings: Settings, elsewhere: ReadElsewhere) -> list[Fact]:
        if not settings.is_on("stale"):
            return []
        record, row = elsewhere.here().record, agents.peek(event.agent)
        always = set(chosen(record))
        changed = {s[SKILL.name]: s[SKILL.changed] for s in skills(record, row.n) if s[SKILL.stale]}
        rest = ", ".join(sorted(set(changed) - always))
        return [*owed(row, {name: at for name, at in changed.items() if name in always}),
                *([StaleSkillsNamed(agent=row.n, skills=rest).once(f"{row.n}:{rest}")] if rest else [])]


class SpotSessionStart(Listener[SessionStarted]):
    def listen(self, event: SessionStarted, agents: ReadRows[AgentRow], settings: Settings, elsewhere: ReadElsewhere, clock: Clock) -> list[Fact]:
        if not settings.is_on("always"):
            return []
        record, row = elsewhere.here().record, agents.peek(event.agent)
        present = {skill[SKILL.name] for skill in catalogue(record.root.parent)}
        current = set(loaded_at(row))
        recent = set() if current else present & recent_before_compaction(row, int(settings.recent))
        missing = {name: clock.now() for name in {*chosen(record), *recent} - current}
        return [SessionOwesSkills(agent=row.n, session=row.title, skills=tuple(missing.items()))]


class SpotSkillsTheUserNames(Listener[MessageCreated]):
    def listen(self, event: MessageCreated, agents: ReadRows[AgentRow], messages: ReadRows[Message], settings: Settings, elsewhere: ReadElsewhere, clock: Clock) -> list[Fact]:
        row = agents.primary_to_read()
        if event.actor != USER or not row or not settings.is_on("keywords"):
            return []
        return owed(row, named_skills(elsewhere.here().record, row, messages.peek(event.n).brief, clock.now()))


class SpotSkillLoad(Listener[ToolFinished]):
    def listen(self, event: ToolFinished, settings: Settings, clock: Clock) -> list[Fact]:
        return [SkillLoaded(agent=event.agent, skill=event.skill, at=clock.now())] if event.skill and settings.is_on("chat") else []


class SpotCommandNeedingSkill(Listener[ToolCallAnswered]):
    def listen(self, event: ToolCallAnswered, agents: ReadRows[AgentRow], marks: ReadMarks, elsewhere: ReadElsewhere) -> list[Fact]:
        row, since = agents.peek(event.agent), marks.last(NAME).since
        skill = skill_not_loaded(event.command, event.subagent, row, since, elsewhere.here().record)
        return owed(row, {skill: since}) if skill else []


class CountRefusals(Listener[ToolCallAnswered]):
    def listen(self, event: ToolCallAnswered, agents: ReadRows[AgentRow], elsewhere: ReadElsewhere) -> list[Fact]:
        if event.subagent or asks_for_a_load(event.tool, event.input, event.command):
            return []
        row = agents.peek(event.agent)
        return [RefusalCounted(agent=row.n, wanted=refusal_wanted(elsewhere.here().record, row))]
