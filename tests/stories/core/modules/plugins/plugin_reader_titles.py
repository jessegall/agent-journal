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


def test_an_old_reader_file_is_rewritten_with_its_first_comment_as_its_title_and_loads_with_it(new_story):
    story = new_story(fixture=UserJoined)
    folder, readers = reader_folder(story)
    (readers / "cart-test.pattern").write_text("# each package's result\n^(ok|FAIL)\\s\nlabel: Cart tests\nfinished: ^ok\n")
    (readers / "merge.sh").write_text("#!/bin/sh\n# what a merge did\n# label: Worker merge\ncat\n")
    by_name = installed_readers(story, folder)
    rewritten = (installed_file(story, "cart-test.pattern"), installed_file(story, "merge.sh"))
    story.expect_rows(by_name["cart-test"]["title"] == "each package's result", by_name["merge"]["title"] == "what a merge did",
                      rewritten[0].startswith("title: each package's result\n^(ok|FAIL)"), "# title: what a merge did" in rewritten[1], detail=str(rewritten))


def test_a_new_reader_file_that_declares_its_title_loads_with_it_and_is_left_as_it_is(new_story):
    story = new_story(fixture=UserJoined)
    folder, readers = reader_folder(story)
    text = "title: Judging with the sample\n^judged\nfinished: ^judged\n"
    (readers / "sample-reader.pattern").write_text(text)
    by_name = installed_readers(story, folder)
    story.expect_rows(by_name["sample-reader"]["title"] == "Judging with the sample", installed_file(story, "sample-reader.pattern") == text)
