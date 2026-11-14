from types import SimpleNamespace

from engine.driver.open_row import OpenRow
from engine.driver.rule_answer import RuleAnswer
from engine.enums.state_tier import StateTier
from engine.time.timestamp import Timestamp
from core.modules.skills.rules.command_skill_rule import CommandSkillRule
from core.modules.skills.states.skill_command_run import SkillCommandRun
from core.modules.skills.support.missing_command_skill import MissingCommandSkill

NOW = Timestamp.parsed("2026-11-14T07:00:00+00:00")


class Untouched:
    """Stands for anything the rule would only reach after it found a journal command: any use fails."""


def hook(journal_commands: tuple[str, ...]) -> SimpleNamespace:
    return SimpleNamespace(agent_id=7, timestamp=NOW, event=SimpleNamespace(tool=SimpleNamespace(journal_commands=journal_commands)))


def test_the_state_is_asked_in_place_for_a_prompt_role_and_gates_the_command_skill_rule():
    assert (SkillCommandRun.name, SkillCommandRun.tier, SkillCommandRun.rules) == ("skills.command-run", StateTier.IN_PLACE, [CommandSkillRule])


def test_with_no_journal_command_the_state_is_closed_and_the_rule_answers_allowed_touching_no_cache():
    required = SimpleNamespace(is_required=True)
    assert SkillCommandRun(required).open_rows(hook(())) == []
    rule = CommandSkillRule(MissingCommandSkill(Untouched(), Untouched(), required, Untouched()), Untouched())
    assert rule.answer(hook(())) == RuleAnswer.allowed()


def test_while_skills_are_not_required_the_state_is_closed_and_the_rule_answers_allowed():
    off = SimpleNamespace(is_required=False)
    assert SkillCommandRun(off).open_rows(hook(("task",))) == []
    rule = CommandSkillRule(MissingCommandSkill(Untouched(), Untouched(), off, Untouched()), Untouched())
    assert rule.answer(hook(("task",))) == RuleAnswer.allowed()


def test_a_journal_command_opens_the_state_for_this_hook():
    assert SkillCommandRun(SimpleNamespace(is_required=True)).open_rows(hook(("task",))) == [OpenRow("hook", 0, NOW)]
