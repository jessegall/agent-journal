import json

from tests.stories.core.modules.plugins.support.plugin_samples import sample_plugin_folder
from tests.stories.core.support.fixtures import UserJoined


def reader_folder(story):
    folder = sample_plugin_folder(story.home.folder.parent)
    readers = folder / ".journal-plugin" / "readers"
    readers.mkdir(parents=True)
    return folder, readers


def installed_readers(story, folder) -> dict[str, dict]:
    story.expect_success(f"plugin install {folder} --yes", actor=story.user)
    rows = json.loads(story.run("reader list --json --limit 100", actor=story.user).output_text)["rows"]
    return {row["name"]: row for row in rows}


def installed_file(story, name: str) -> str:
    """The text of the reader file in the plugin's installed folder, which is where the journal rewrites it."""
    return next(story.home.folder.rglob(name)).read_text()


def test_a_new_reader_file_that_declares_its_title_loads_with_it_and_is_left_as_it_is(new_story):
    story = new_story(fixture=UserJoined)
    folder, readers = reader_folder(story)
    text = "title: Judging with the sample\n^judged\nfinished: ^judged\n"
    (readers / "sample-reader.pattern").write_text(text)
    name_index = installed_readers(story, folder)
    story.expect_rows(name_index["sample-reader"]["title"] == "Judging with the sample", installed_file(story, "sample-reader.pattern") == text)
