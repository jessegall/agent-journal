import json
import os
from pathlib import Path

from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from suites.coding.support.shell_file_changes import READ_LIMIT_BYTES
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.suites.coding.file_edits import script_sample
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment


def test_two_commands_count_only_the_lines_each_changed_even_before_a_commit(new_story):
    story = new_story(fixture=BuilderStarted)
    repository = repository_environment(story)
    repository.committed("cart.py", "TOTAL = 0\n", "the cart")
    path = repository.folder / "cart.py"
    path.write_text("TOTAL = 1\n")
    sample = script_sample(repository, "cart.py")
    story.hook("s-1", sample.with_fields(event="pre_tool_use"))
    path.write_text("TOTAL = 1\nTAX = 2\n")
    story.hook("s-1", sample)
    story.expect_success("file-edit show 1", "added: 1", "removed: 0")
    story.hook("s-1", sample.with_fields(event="pre_tool_use"))
    path.write_text("TOTAL = 1\nTAX = 3\n")
    story.hook("s-1", sample)
    story.expect_success("file-edit show 2", "added: 1", "removed: 1")
    row = json.loads(story.run("file-edit show 2 --json", actor=story.agent).output_text)
    changes = [(line["line_type"], line["text"]) for line in json.loads(row["rows"]) if line["line_type"] != "ctx"]
    story.expect_rows(changes == [("del", "TAX = 2"), ("add", "TAX = 3")])


def test_a_new_file_then_a_second_command_records_creation_then_only_the_edit(new_story):
    story = new_story(fixture=BuilderStarted)
    repository = repository_environment(story)
    sample = script_sample(repository, "fresh.py")
    path = repository.folder / "fresh.py"
    story.hook("s-1", sample.with_fields(event="pre_tool_use"))
    path.write_text("ONE = 1\n")
    story.hook("s-1", sample)
    story.expect_success("file-edit show 1", "added: 1", "removed: 0", "edit_type: new")
    story.hook("s-1", sample.with_fields(event="pre_tool_use"))
    path.write_text("ONE = 1\nTWO = 2\n")
    story.hook("s-1", sample)
    story.expect_success("file-edit show 2", "added: 1", "removed: 0", "edit_type: edit")


def test_a_fifty_megabyte_file_is_never_read_in_full_by_a_hook(new_story, monkeypatch):
    story = new_story(fixture=BuilderStarted)
    repository = repository_environment(story)
    path = repository.folder / "large.txt"
    sample = script_sample(repository, "large.txt")
    story.hook("s-1", sample.with_fields(event="pre_tool_use"))
    with path.open("wb") as handle:
        handle.truncate(50 * 1024 * 1024)
    read_text = Path.read_text
    unbounded_reads = []
    requested_bytes = []
    fdopen = os.fdopen

    def counted_open(descriptor, *args, **kwargs):
        handle = fdopen(descriptor, *args, **kwargs)
        read = handle.read

        def counted_read(size=-1):
            requested_bytes.append(size)
            return read(size)

        handle.read = counted_read
        return handle

    def tracked_read_text(file, *args, **kwargs):
        if file == path:
            unbounded_reads.append(file.stat().st_size)
            return ""
        return read_text(file, *args, **kwargs)

    monkeypatch.setattr(Path, "read_text", tracked_read_text)
    monkeypatch.setattr(os, "fdopen", counted_open)
    story.hook("s-1", sample)
    story.expect_rows(unbounded_reads == [])
    story.expect_success("file-edit list", "nothing found")
    story.hook("s-1", sample.with_fields(event="pre_tool_use"))
    story.hook("s-1", sample)
    story.expect_success("file-edit list", "nothing found")
    story.expect_rows(all(0 <= size <= READ_LIMIT_BYTES for size in requested_bytes), sum(requested_bytes) <= READ_LIMIT_BYTES)


def test_a_post_hook_without_its_pre_hook_cannot_attribute_earlier_edits(new_story):
    story = new_story(fixture=BuilderStarted)
    repository = repository_environment(story)
    (repository.folder / "cart.py").write_text("TOTAL = 1\n")
    story.hook("s-1", script_sample(repository, "cart.py"))
    story.expect_success("file-edit list", "nothing found")


def test_a_command_that_deletes_a_file_records_its_removals_once(new_story):
    story = new_story(fixture=BuilderStarted)
    repository = repository_environment(story)
    path = repository.folder / "cart.py"
    path.write_text("TOTAL = 1\n")
    sample = script_sample(repository, "cart.py")
    story.hook("s-1", sample.with_fields(event="pre_tool_use"))
    path.unlink()
    story.hook("s-1", sample)
    story.hook("s-1", sample)
    story.expect_success("file-edit show 1", "added: 0", "removed: 1")
    story.expect_refusal("file-edit show 2", "")


def test_a_failed_command_discards_its_pre_state(new_story):
    story = new_story(fixture=BuilderStarted)
    repository = repository_environment(story)
    sample = script_sample(repository, "cart.py")
    story.hook("s-1", sample.with_fields(event="pre_tool_use"))
    story.hook("s-1", sample.with_fields(event="post_tool_use_failure"))
    (repository.folder / "cart.py").write_text("TOTAL = 1\n")
    story.hook("s-1", sample)
    story.expect_success("file-edit list", "nothing found")


def test_commands_with_different_tool_ids_keep_their_own_pre_states(new_story):
    story = new_story(fixture=BuilderStarted)
    repository = repository_environment(story)
    first = script_sample(repository, "cart.py").with_raw({"cwd": str(repository.folder), "tool_use_id": "first"})
    second = script_sample(repository, "tax.py").with_raw({"cwd": str(repository.folder), "tool_use_id": "second"})
    story.hook("s-1", first.with_fields(event="pre_tool_use"))
    story.hook("s-1", second.with_fields(event="pre_tool_use"))
    (repository.folder / "cart.py").write_text("TOTAL = 1\n")
    (repository.folder / "tax.py").write_text("TAX = 1\n")
    story.hook("s-1", second)
    story.hook("s-1", first)
    story.expect_success("file-edit show 1", "path: tax.py", "added: 1", "removed: 0")
    story.expect_success("file-edit show 2", "path: cart.py", "added: 1", "removed: 0")


def test_rejected_binary_files_still_spend_the_commands_read_budget(new_story):
    story = new_story(fixture=BuilderStarted)
    repository = repository_environment(story)
    part = ShellPart("python3", "process", ["-"], output_paths=["a.bin", "b.bin", "cart.py"])
    sample = HookSamples.shell("python3 -", part).with_raw({"cwd": str(repository.folder)})
    story.hook("s-1", sample)
    (repository.folder / "a.bin").write_bytes(b"\0" * (READ_LIMIT_BYTES // 2))
    (repository.folder / "b.bin").write_bytes(b"\0" * (READ_LIMIT_BYTES // 2))
    (repository.folder / "cart.py").write_text("TOTAL = 1\n")
    story.hook("s-1", sample.with_fields(event="post_tool_use"))
    story.expect_success("file-edit list", "nothing found")
