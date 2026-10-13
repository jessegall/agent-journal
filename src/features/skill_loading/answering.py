from engine.journal_calls import calls
from events.answers import Allowed, Answer, Refused
from events.asking import ToolCallAsked
from features.skill_loading.catalogue import has_read_every_load, loaded_at, loaded_before_compaction, teaching_command
from features.skill_loading.required import outstanding
from framework.loaded import FEATURES
from payload import SKILL_READ
from receiving import Answerer
from resources.types import AgentRow
from serving import SERVED, Providers, ReadElsewhere, ReadMarks, ReadRows, Settings

REFUSED = "skill_loading.refused"
NAME = "skill_loading"


def asks_for_a_load(tool: str, input: str, command: str) -> bool:
    """Whether the call loads a skill, which is never held back: it is how the skill gets loaded."""
    return tool == "Skill" or bool(SKILL_READ.search(input or command))


def refusal_wanted(record, row: AgentRow) -> bool:
    return bool(outstanding(record, row)) and has_read_every_load(row)


def next_count(count: int, wanted: bool, limit: int, aside: int) -> int:
    """How many refusals in a row there will have been after this call, counting the ones let through while the gate steps aside."""
    if not wanted:
        return 0
    return count % (limit + aside) + 1 if aside else count + 1


class RefuseUntilLoaded(Answerer[ToolCallAsked]):
    def answer(self, event: ToolCallAsked, agents: ReadRows[AgentRow], marks: ReadMarks, settings: Settings, elsewhere: ReadElsewhere) -> Answer:
        record, row = elsewhere.here().record, agents.peek_session(event.session)
        if event.subagent or asks_for_a_load(event.tool, event.input, event.command) or not refusal_wanted(record, row):
            return Allowed()
        limit, aside = max(0, int(settings.most_refusals)), max(0, int(settings.steps_aside))
        if next_count(marks.last(REFUSED).count, True, limit, aside) > limit:
            return Allowed()
        missing = outstanding(record, row)
        return Refused(FEATURES["skill_loading"].line_text("required", skills=", ".join(missing), loads=", ".join(provider_load(row, name) for name in missing)))


def provider_load(row: AgentRow, name: str) -> str:
    provider = SERVED.given(Providers).offers(row.provider)
    return provider.skill_load(name) if provider else f"Skill: {name}"


def skill_not_loaded(command: str, subagent: bool, row: AgentRow, since: float, record) -> str:
    """The skill that teaches the journal command a call runs, when the agent has not loaded it since the window opened; empty when the call runs no such command."""
    found = None if subagent else next((made for made in calls(command) if made.noun), None)
    skill = teaching_command(record.root.parent, found.noun) if found else ""
    at = loaded_at(row).get(skill, 0.0)
    return skill if skill and (not at or at < since) and skill not in loaded_before_compaction(row) else ""


class RefuseCommandNeedingSkill(Answerer[ToolCallAsked]):
    def answer(self, event: ToolCallAsked, agents: ReadRows[AgentRow], marks: ReadMarks, elsewhere: ReadElsewhere) -> Answer:
        record, row = elsewhere.here().record, agents.peek_session(event.session)
        skill = skill_not_loaded(event.command, event.subagent, row, marks.last(NAME).since, record)
        if not skill:
            return Allowed()
        return Refused(FEATURES["skill_loading"].line_text("required", skills=skill, loads=provider_load(row, skill)))
