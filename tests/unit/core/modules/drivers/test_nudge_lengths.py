from core.modules.skills.nudges.read_skill_first_message import ReadSkillFirstMessage
from core.modules.triggers.nudges.trigger_line_message import TriggerLineMessage


def expect_nudge_skill_with(item, path, expected) -> None:
    actual = item.nudge(instruction=path).text
    assert expected in actual, actual


def expect_nudge_trigger(item, number, expected) -> None:
    actual = item.nudge(trigger=number).text
    assert actual == expected, actual


def test_a_line_someone_wrote_and_a_path_to_open_stay_whole():
    expect_nudge_trigger(TriggerLineMessage.declared(), 500, TriggerLineMessage.declared().nudge(trigger=500).text)
    path = ".agents/skills/commandments-rows-through-their-repository/SKILL.md"
    expect_nudge_skill_with(ReadSkillFirstMessage.declared(), path, path)
