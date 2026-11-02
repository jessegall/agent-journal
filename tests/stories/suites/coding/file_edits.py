import json

from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted

CART_EDIT = HookSamples.edit("src/cart.py", 3, 1).with_fields(event="post_tool_use")


def test_an_agent_that_edits_a_file_leaves_a_file_edit_with_its_path_and_counts(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", CART_EDIT)
    story.expect_success("file-edit show 1", "path: src/cart.py", "added: 3", "removed: 1", f"agent_id: {story.agent.id}")


def test_an_edit_outside_the_project_leaves_no_file_edit(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", HookSamples.edit("/private/tmp/claude-501/scratch.py", 3, 1).with_fields(event="post_tool_use"))
    story.expect_success("file-edit list", "nothing found")


def test_an_edit_the_agent_is_about_to_make_leaves_no_file_edit(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", HookSamples.edit("src/cart.py", 3, 1))
    story.expect_success("file-edit list", "nothing found")


def test_a_tool_that_reads_files_leaves_no_file_edit(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", HookSamples.sample("post_tool_use", {"name": "Read", "category": "read", "files": ["src/cart.py"], "diff": None}))
    story.expect_success("file-edit list", "nothing found")


ROWS = [{"line_type": "add", "line": 4, "text": "total = 0"}, {"line_type": "del", "line": 4, "text": "total = None"}]


def edit_with_rows(existed: bool = True):
    diff = {"path": "src/cart.py", "existed": existed, "lines_added": 1, "lines_removed": 1}
    return HookSamples.sample("post_tool_use", {"name": "Edit", "category": "edit", "files": ["src/cart.py"], "shell": None, "diff": diff, "diff_rows": ROWS})


def test_a_file_edit_keeps_the_lines_it_changed(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", edit_with_rows())
    story.run_listeners()
    row = json.loads(story.run("file-edit show 1 --json", actor=story.agent).output_text)
    assert json.loads(row["rows"]) == ROWS and row["edit_type"] == "edit"


def test_an_edit_that_made_the_file_says_so(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", edit_with_rows(existed=False))
    story.run_listeners()
    assert json.loads(story.run("file-edit show 1 --json", actor=story.agent).output_text)["edit_type"] == "new"


def test_a_path_inside_the_environments_folder_is_kept_from_that_folder(new_story):
    story = new_story(fixture=BuilderStarted)
    folder = json.loads(story.run("environment show 1 --json", actor=story.agent).output_text)["folder"]
    story.hook("s-1", HookSamples.edit(f"{folder}/src/cart.py", 1, 0).with_fields(event="post_tool_use"))
    story.run_listeners()
    assert json.loads(story.run("file-edit show 1 --json", actor=story.agent).output_text)["path"] == "src/cart.py"

