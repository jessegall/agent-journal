from types import SimpleNamespace

from engine.driver.agent_state import StateTier
from engine.driver.open_row import OpenRow
from engine.driver.rule_answer import RuleAnswer
from engine.time.timestamp import Timestamp
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.rules.skill_read_first_rule import SkillReadFirstRule
from core.modules.skills.states.skill_load_required import SkillLoadRequired

CREATED = Timestamp.parsed("2026-11-14T07:00:00+00:00")
HOOK = SimpleNamespace(agent_id=7)


class Untouched:
    """Stands for anything the rule would only reach after it found a skill due: any use fails."""


def unread(rows: list[AgentSkill]) -> SimpleNamespace:
    return SimpleNamespace(due_rows=lambda agent_id: rows, names=lambda agent_id: [row.skill for row in rows])


def due_skill() -> AgentSkill:
    return AgentSkill(id=3, version=1, created_at=CREATED, updated_at=CREATED, session_agent_id=7, creator_id=1, skill="journal-notes")


def test_the_state_is_asked_in_place_for_a_prompt_role_and_gates_the_read_first_rule():
    assert (SkillLoadRequired.name, SkillLoadRequired.tier, SkillLoadRequired.rules) == ("skills.load-required", StateTier.IN_PLACE, [SkillReadFirstRule])


def test_with_no_due_skill_the_state_is_closed_and_the_rule_answers_allowed_alone():
    nothing = unread([])
    assert SkillLoadRequired(nothing).open_rows(HOOK) == []
    rule = SkillReadFirstRule(nothing, Untouched(), Untouched(), Untouched())
    assert rule.answer(HOOK) == RuleAnswer.allowed()


def test_with_a_due_skill_the_state_opens_with_the_first_row():
    skill = due_skill()
    assert SkillLoadRequired(unread([skill])).open_rows(HOOK) == [OpenRow("agent_skill", 3, CREATED)]
