from dataclasses import fields
from types import SimpleNamespace

from engine.driver.interval import Interval
from engine.driver.rule_answer import RuleAnswer
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from core.modules.skills.support.block_conditions.skill_loaded import SkillLoaded
from core.modules.skills.support.skill_block import SkillBlock
from core.modules.skills.support.skill_nudges import READ_COMMAND_SKILL_FIRST, READ_SKILL_FIRST, SKILL_COUNTDOWN, SKILL_TOOL_USES

HOOK = SimpleNamespace(agent_id=7)


def same_block(first, second) -> bool:
    plain = [field.name for field in fields(first) if field.name not in ("after", "condition")]
    return (all(getattr(first, name) == getattr(second, name) for name in plain) and first.after.spans == second.after.spans
            and (type(first.condition), first.condition.text) == (type(second.condition), second.condition.text))


def built_before(nudge, folder: str, strict: bool):
    return RuleAnswer.allowed().blocking_after(HOOK, nudge, SkillLoaded(folder), Interval(ToolUseSpan(SKILL_TOOL_USES)), SKILL_COUNTDOWN.nudge("{left}", skill=folder), strict).commands[0]


def test_the_block_for_an_unread_skill_is_the_block_blocking_after_built_before():
    nudge = READ_SKILL_FIRST.nudge(instruction="load this first with the Skill tool: journal-notes")
    assert same_block(SkillBlock.answer(HOOK, nudge, "journal-notes").commands[0], built_before(nudge, "journal-notes", False))


def test_a_strict_block_for_a_command_skill_stays_strict():
    nudge = READ_COMMAND_SKILL_FIRST.nudge(instruction="load this first with the Skill tool: journal-notes")
    block = SkillBlock.answer(HOOK, nudge, "journal-notes", strict=True).commands[0]
    assert block.strict is True and same_block(block, built_before(nudge, "journal-notes", True))
