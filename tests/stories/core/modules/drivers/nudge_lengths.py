from core.modules.skills.support.skill_nudges import READ_SKILL_FIRST
from core.modules.triggers.support.trigger_nudges import TRIGGER_LINE


def test_a_line_someone_wrote_and_a_path_to_open_stay_whole():
    assert TRIGGER_LINE.nudge(text="x" * 500).text == "x" * 500
    path = ".agents/skills/commandments-rows-through-their-repository/SKILL.md"
    assert path in READ_SKILL_FIRST.nudge(path=path).text
