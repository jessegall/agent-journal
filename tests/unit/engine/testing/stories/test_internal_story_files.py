from engine.testing.stories.internal_story_files import INTERNAL_STORY_FILES, InternalStoryFiles


def written(root, text):
    list_file = root / INTERNAL_STORY_FILES
    list_file.parent.mkdir(parents=True)
    list_file.write_text(text)
    return InternalStoryFiles(root)


def test_a_listed_story_file_passes_the_overlap_check_by_and_an_unlisted_one_does_not(tmp_path):
    files = written(tmp_path, "tests/stories/core/listed.py\n")
    assert files.holds(tmp_path / "tests/stories/core/listed.py")
    assert not files.holds(tmp_path / "tests/stories/core/unlisted.py")


def test_the_header_and_blank_lines_name_no_file(tmp_path):
    files = written(tmp_path, "# story files that may still reach internals\n\ntests/stories/core/listed.py\n")
    assert files.files == frozenset({"tests/stories/core/listed.py"})


def test_with_no_list_file_no_story_passes_by(tmp_path):
    assert not InternalStoryFiles(tmp_path).holds(tmp_path / "tests/stories/core/listed.py")
