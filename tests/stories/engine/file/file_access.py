import os
from argparse import Namespace
from pathlib import Path
from unittest.mock import patch

import pytest

from core.modules.documents.commands.support.text_body import TextBody
from core.modules.processes.support.run_queue_halt import RunQueueHalt
from engine.file.file_access import FileAccess
from core.base.module.module_finder import ModuleFinder
from engine.database.repeated_calls_error import RepeatedCallsError
from tests.stories.support.story_checks import expect_value


@pytest.fixture
def document_file(new_story, tmp_path):
    story = new_story()
    path = tmp_path / "notes.md"
    path.write_text("First draft")
    return story, path, Namespace(body=None, file=str(path))


def test_one_request_cannot_read_the_same_document_file_twice(document_file):
    story, path, arguments = document_file
    with pytest.raises(RepeatedCallsError, match="read file twice"):
        with story.repeated_work.request():
            expect_value(TextBody.given(arguments), "First draft")
            TextBody.given(arguments)


def test_a_later_request_reuses_the_cached_document_without_opening_it(document_file):
    story, path, arguments = document_file
    expect_value(TextBody.given(arguments), "First draft")
    with patch.object(Path, "open", autospec=True, side_effect=Path.open) as opened:
        with story.repeated_work.request():
            expect_value(TextBody.given(arguments), "First draft")
    expect_value(opened.call_count, 0)


def test_a_write_invalidates_the_cached_file_even_if_its_modified_time_is_restored(new_story):
    story = new_story()
    halt = story.container.get(RunQueueHalt)
    halt.halt("first")
    expect_value(halt.reason, "first")
    status = halt.home.run_queue_halt_file.stat()
    halt.halt("after")
    os.utime(halt.home.run_queue_halt_file, ns=(status.st_atime_ns, status.st_mtime_ns))
    with patch.object(Path, "open", autospec=True, side_effect=Path.open) as opened:
        with story.repeated_work.request():
            expect_value(halt.reason, "after")
    expect_value(opened.call_count, 1)


def test_a_write_keeps_other_files_cached(document_file):
    story, path, arguments = document_file
    expect_value(TextBody.given(arguments), "First draft")
    story.container.get(RunQueueHalt).halt("wait")
    with patch.object(Path, "open", autospec=True, side_effect=Path.open) as opened:
        with story.repeated_work.request():
            expect_value(TextBody.given(arguments), "First draft")
    expect_value(opened.call_count, 0)


def test_an_external_file_change_replaces_the_cached_contents(document_file):
    story, path, arguments = document_file
    expect_value(TextBody.given(arguments), "First draft")
    path.write_text("Changed elsewhere")
    with story.repeated_work.request():
        expect_value(TextBody.given(arguments), "Changed elsewhere")


def test_a_write_allows_a_fresh_read_in_the_same_request(new_story):
    story = new_story()
    halt = story.container.get(RunQueueHalt)
    halt.halt("first")
    with story.repeated_work.request():
        expect_value(halt.reason, "first")
        halt.halt("after")
        expect_value(halt.reason, "after")


def test_different_paths_to_the_same_file_count_as_a_repeat(document_file):
    story, path, arguments = document_file
    linked = path.with_name("linked.md")
    linked.symlink_to(path)
    with pytest.raises(RepeatedCallsError, match="read file twice"):
        with story.repeated_work.request():
            TextBody.given(arguments)
            TextBody.given(Namespace(body=None, file=str(linked)))


def test_an_atomic_replacement_allows_reading_the_changed_target_in_the_same_request(document_file):
    story, path, arguments = document_file
    temporary = path.with_name("replacement.md")
    files = FileAccess.shared()
    files.write(temporary, "After replacement")
    with story.repeated_work.request():
        expect_value(TextBody.given(arguments), "First draft")
        files.replace(temporary, path)
        expect_value(TextBody.given(arguments), "After replacement")


def test_a_write_invalidates_parsed_values_when_the_modified_time_is_unchanged(new_story):
    story = new_story()
    files = FileAccess.shared()
    path = story.home.module_list
    files.write(path, '["alpha.module:Alpha"]')
    finder = story.container.get(ModuleFinder)
    with story.repeated_work.request():
        expect_value(list(finder.plugin_paths()), ["alpha.module:Alpha"])
        status = path.stat()
        files.write(path, '["bravo.module:Bravo"]')
        os.utime(path, ns=(status.st_atime_ns, status.st_mtime_ns))
        expect_value(list(finder.plugin_paths()), ["bravo.module:Bravo"])


def test_a_file_a_program_changed_between_two_reads_is_read_twice_without_a_finding(new_story, tmp_path):
    story = new_story()
    changing = tmp_path / "config"
    changing.write_text("first")
    with story.repeated_work.request():
        FileAccess.shared().read(changing)
        os.utime(changing, ns=(1, 1))
        FileAccess.shared().read(changing)

