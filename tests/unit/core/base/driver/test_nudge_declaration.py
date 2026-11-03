from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType


def test_path_fields_stay_whole_while_free_text_fields_are_shortened():
    declaration = NudgeDeclaration("sample.paths", NudgeType.STEERING, "{name}: {path}", path_fields=["path"])
    path = "/project/" + "long-folder/" * 400 + "SKILL.md"
    assert declaration.nudge(name="x" * 100, path=path).text == "x" * 79 + "…: " + path


def test_merging_path_fields_keeps_every_path_whole():
    declaration = NudgeDeclaration("sample.paths", NudgeType.STEERING, "read {path}", path_fields=["path"])
    paths = tuple(f"/project/{name}/" + "long-folder/" * 20 + "SKILL.md" for name in ("first", "second", "third"))
    merged = declaration.merged([declaration.nudge(path=path) for path in paths])
    assert merged.text == "read " + ", ".join(paths)


def test_free_text_still_has_a_field_limit_and_a_line_limit():
    declaration = NudgeDeclaration("sample.text", NudgeType.STEERING, "{name}: {other}")
    assert declaration.field_text("x" * 100) == "x" * 79 + "…"
    assert len(declaration.nudge(name="x" * 100, other="y" * 100).text) == 120
