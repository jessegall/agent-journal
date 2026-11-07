from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.base.driver.nudge import Nudge


def test_path_fields_stay_whole_while_free_text_fields_are_shortened():
    declaration = NudgeDeclaration("sample.paths", NudgeType.STEERING, "{name}: {path}", path_fields=["path"])
    path = "/project/" + "long-folder/" * 400 + "SKILL.md"
    assert declaration.nudge(name="x" * 100, path=path).text == "x" * 79 + "…: " + path
    assert NudgeDeclaration.restore(declaration.nudge(name="x" * 100, path=path).stored.json).text == "x" * 79 + "…: " + path


def test_merging_path_fields_keeps_every_path_whole():
    declaration = NudgeDeclaration("sample.paths", NudgeType.STEERING, "read {path}", path_fields=["path"])
    paths = tuple(f"/project/{name}/" + "long-folder/" * 20 + "SKILL.md" for name in ("first", "second", "third"))
    merged = declaration.merged([declaration.nudge(path=path) for path in paths])
    assert merged.text == "read " + ", ".join(paths)


def test_free_text_still_has_a_field_limit_and_a_line_limit():
    declaration = NudgeDeclaration("sample.text", NudgeType.STEERING, "{name}: {other}")
    assert declaration.field_text("x" * 100) == "x" * 79 + "…"
    assert len(declaration.nudge(name="x" * 100, other="y" * 100).text) == 120


def test_stored_nudges_keep_their_id_field_plural_words_and_context():
    declaration = NudgeDeclaration("sample.queued", NudgeType.NOTICE, "task {task} waits for {worker}",
                                   plural_text="tasks {task} wait for {worker}", id_field="task")
    nudges = [NudgeDeclaration.restore(declaration.nudge(worker=4, task=task).stored.json) for task in range(40)]
    collapsed = Nudge.collapsed(nudges)
    assert [nudge.text for nudge in collapsed] == ["tasks " + ", ".join(str(task) for task in range(40)) + " wait for 4"]


def test_stored_required_commands_and_plain_text_stay_separate():
    declaration = NudgeDeclaration("sample.required", NudgeType.NOTICE, "read {task}", required_command="journal task show {task}")
    nudges = [declaration.nudge(task=1), declaration.nudge(task=2), Nudge("sample.raw", NudgeType.NOTICE, "task 1"), Nudge("sample.raw", NudgeType.NOTICE, "task 2")]
    stored = [NudgeDeclaration.restore(nudge.stored.json) for nudge in nudges]
    assert [nudge.text for nudge in Nudge.collapsed(stored)] == ["read 1", "read 2", "task 1", "task 2"]
