from types import SimpleNamespace

from engine.driver.hook_transcript import HookTranscript
from engine.driver.open_row import OpenRow
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from engine.enums.state_tier import StateTier
from engine.row.metadata import Metadata
from engine.time.timestamp import Timestamp
from core.modules.skills.commands.load_skill.load_skill import LoadSkill
from core.modules.skills.commands.record_kept_skills.record_kept_skills import RecordKeptSkills
from core.modules.skills.commands.record_kept_skills.record_kept_skills_handler import RecordKeptSkillsHandler
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.rules.record_kept_skills_rule import RecordKeptSkillsRule
from core.modules.skills.rules.skill_read_first_rule import SkillReadFirstRule
from core.modules.skills.states.kept_skills_record import KeptSkillsRecord
from core.modules.skills.support.kept_skill_mark import KeptSkillMark

CREATED = Timestamp.parsed("2026-11-14T07:00:00+00:00")
HOOK = SimpleNamespace(agent_id=7, event=SimpleNamespace(transcript=HookTranscript("claude", "f1", "/t.jsonl")))
LOAD = LoadSkill(7, "journal-notes", "digest")


def due_skill() -> AgentSkill:
    return AgentSkill(id=3, version=1, created_at=CREATED, updated_at=CREATED, session_agent_id=7, creator_id=1, skill="journal-notes")


def unread(rows: list[AgentSkill]) -> SimpleNamespace:
    return SimpleNamespace(due_rows=lambda agent_id: rows, names=lambda agent_id: [row.skill for row in rows])


def agent(session: str = "s-1", metadata: Metadata = Metadata()) -> SimpleNamespace:
    return SimpleNamespace(id=7, session=session, metadata=metadata)


class Untouched:
    """Stands for the transcript reader once a record exists: any use fails."""

    def loads(self, agent_id, transcript, due):
        raise AssertionError("the transcript is not read once the record exists")


def test_the_state_is_deferred_and_hands_the_record_rule_to_the_deferred_runner():
    assert (KeptSkillsRecord.name, KeptSkillsRecord.tier, KeptSkillsRecord.deferred) == ("skills.kept-record-due", StateTier.DEFERRED, [RecordKeptSkillsRule])


def test_the_state_opens_for_a_due_skill_with_no_record_and_stays_closed_otherwise():
    skill = due_skill()
    opens = lambda rows, recorded: KeptSkillsRecord(unread(rows), SimpleNamespace(is_recorded=lambda agent_id: recorded)).open_rows(HOOK)
    assert opens([skill], False) == [OpenRow("agent_skill", 3, CREATED)]
    assert opens([skill], True) == [] and opens([], False) == []


def test_the_rule_runs_after_a_tool_use_and_hands_back_one_command_for_the_call():
    call = SimpleNamespace(session_agent_id=7, transcript=HookTranscript("claude", "f1", "/t.jsonl"))
    assert RecordKeptSkillsRule.hook == HookEventName.POST_TOOL_USE
    assert RecordKeptSkillsRule().after(call) == [RecordKeptSkills(7, "claude", "f1", "/t.jsonl")]


def test_a_record_is_for_one_session_and_compaction_only():
    recorded = agent(metadata=KeptSkillMark.recorded(agent()))
    assert KeptSkillMark.is_recorded(recorded) and not KeptSkillMark.is_recorded(agent("s-2", recorded.metadata))
    assert not KeptSkillMark.is_recorded(agent())


def test_the_handler_loads_each_kept_due_skill_once_and_marks_the_agent_recorded():
    dispatched, saved = [], []
    kept = SimpleNamespace(loads=lambda agent_id, transcript, due: [LOAD] if due == ["journal-notes"] else [])
    bus = SimpleNamespace(dispatch=lambda command, context: dispatched.append(command))
    repository = SimpleNamespace(save_metadata=lambda stored, metadata, context: saved.append(metadata) or stored)
    handler = RecordKeptSkillsHandler(unread([due_skill()]), kept, SimpleNamespace(find=lambda agent_id: agent()), bus, repository)
    handler.handle(RecordKeptSkills(7, "claude", "f1", "/t.jsonl"), SimpleNamespace())
    assert dispatched == [LOAD] and saved == [KeptSkillMark.recorded(agent())]


def test_with_nothing_due_the_handler_reads_no_transcript_and_still_marks_the_record():
    saved = []
    repository = SimpleNamespace(save_metadata=lambda stored, metadata, context: saved.append(metadata) or stored)
    handler = RecordKeptSkillsHandler(unread([]), Untouched(), SimpleNamespace(find=lambda agent_id: agent()), SimpleNamespace(), repository)
    handler.handle(RecordKeptSkills(7, "claude", "f1", "/t.jsonl"), SimpleNamespace())
    assert saved == [KeptSkillMark.recorded(agent())]


def test_the_read_first_rule_answers_the_same_from_the_transcript_before_the_record_and_from_the_rows_after():
    required = SimpleNamespace(is_required=True)
    before = SkillReadFirstRule(unread([due_skill()]), None, required, SimpleNamespace(is_recorded=lambda agent_id: False, loads=lambda agent_id, transcript, due: [LOAD]))
    after = SkillReadFirstRule(unread([]), None, required, SimpleNamespace(is_recorded=lambda agent_id: True, loads=Untouched().loads))
    assert before.answer(HOOK) == after.answer(HOOK) == RuleAnswer.allowed()


def test_after_the_record_the_read_first_rule_does_not_read_the_transcript_for_a_skill_still_due():
    rule = SkillReadFirstRule(unread([due_skill()]), None, SimpleNamespace(is_required=False), SimpleNamespace(is_recorded=lambda agent_id: True, loads=Untouched().loads))
    assert rule.answer(HOOK) == RuleAnswer.allowed()
