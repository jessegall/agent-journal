import pytest

from engine.testing.stories.old_path_story_files import OLD_PATH_STORY_FILES, OldPathStoryFiles

PINNED = "tests/stories/core/modules/drivers/agent_pause.py"


def written(root, text):
    list_file = root / OLD_PATH_STORY_FILES
    list_file.parent.mkdir(parents=True)
    list_file.write_text(text)
    return OldPathStoryFiles.read(root)


def test_a_pinned_file_runs_with_no_slice_live_and_names_its_replacement(tmp_path):
    files = written(tmp_path, f"# pinned files\n\n{PINNED} safety tests/unit/engine/agent_machine/test_pause.py\n")
    assert files.live_slices(PINNED, ("safety",)) == ()
    assert files.replacements[PINNED] == "tests/unit/engine/agent_machine/test_pause.py"


def test_a_file_not_on_the_list_runs_with_every_live_slice(tmp_path):
    files = written(tmp_path, f"{PINNED} safety tests/unit/engine/agent_machine/test_pause.py\n")
    assert files.live_slices("tests/stories/core/modules/messages/delivery.py", ("safety",)) == ("safety",)


def test_a_line_without_its_replacement_is_named(tmp_path):
    with pytest.raises(ValueError, match=PINNED):
        written(tmp_path, f"{PINNED} safety\n")
