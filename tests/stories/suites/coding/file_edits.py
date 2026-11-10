import json

from engine.query.queries import Queries
from core.modules.processes.models.process import Process
from core.testing.hook_samples import HookSamples
from suites.coding.commands.record_file_edit import record_file_edit_handler
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import BuilderStarted, OpenTaskOrchestrator
from tests.stories.core.support.scanned_edits import scanned_edit
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session
from tests.stories.support.story_checks import expect_value

CART_EDIT = HookSamples.edit("src/cart.py", 3, 1).with_fields(event="post_tool_use")
ROWS = [{"line_type": "del", "line": 1, "text": "TOTAL = 0"}, {"line_type": "add", "line": 1, "text": "TOTAL = 1"}]


def test_the_instruction_files_the_journal_writes_for_a_worker_are_not_its_edits_and_its_own_edit_is(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    session = worker_session(story, dispatched_worker(story))
    for path in ("AGENTS.md", "CLAUDE.md", "AGENTS.original.md"):
        scanned_edit(story, session, path, 6, 24)
    story.expect_refusal("file-edit show 1", "no")
    scanned_edit(story, session, "src/cart.py", 3, 1)
    story.expect_success("file-edit show 1", "path: src/cart.py")


def test_a_scan_of_a_shell_line_keeps_each_file_for_the_agent_of_its_process(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    repository = repository_environment(story)
    story.hook("s-1", HookSamples.shell("python3 -", ShellPart("python3", "process", ["-"])).with_raw({"cwd": str(repository.folder)}))
    process_id = story.container.get(Queries).query(Process).newest().first().id
    report = story.home.folder / "scan-report.json"
    report.write_text(json.dumps({"folder": str(repository.folder), "changes": [
        {"diff": {"path": "fresh.py", "existed": False, "lines_added": 2, "lines_removed": 0}, "rows": []},
        {"diff": {"path": "old.py", "existed": True, "lines_added": 0, "lines_removed": 3}, "rows": []}]}))
    story.expect_success(f"file-edit record-changes {report} --process {process_id}")
    story.expect_success("file-edit show 1", "edit_type: new", f"session_agent_id: {story.agent.id}")
    story.expect_success("file-edit show 2", "removed: 3", "edit_type: edit")


def test_no_hook_records_a_file_edit_by_itself_since_the_scan_is_the_one_source(new_story):
    story = new_story(fixture=BuilderStarted)
    repository = repository_environment(story)
    part = ShellPart("python3", "process", ["-"], output_paths=["cart.py"])
    story.hook("s-1", HookSamples.shell("python3 -", part).with_fields(event="post_tool_use").with_raw({"cwd": str(repository.folder)}))
    story.hook("s-1", CART_EDIT)
    story.run_listeners()
    story.expect_refusal("file-edit show 1", "no")


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


def test_a_path_inside_the_environments_folder_is_kept_from_that_folder(new_story):
    story = new_story(fixture=BuilderStarted)
    folder = json.loads(story.run("environment show 1 --json", actor=story.agent).output_text)["folder"]
    scanned_edit(story, "s-1", f"{folder}/src/cart.py")
    story.expect_rows(json.loads(story.run("file-edit show 1 --json", actor=story.agent).output_text)["path"] == "src/cart.py")



def test_a_scan_is_kept_for_the_agent_of_its_session_whatever_environment_it_works_in(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success("environment make elsewhere /work/elsewhere", actor=story.user)
    alternate_folder = story.new_row_id("agent start s-9 claude worker --environment elsewhere")
    scanned_edit(story, "s-9", "src/cart.py", 2, 0)
    story.expect_success("file-edit show 1", "path: src/cart.py", f"session_agent_id: {alternate_folder}")


def test_the_log_keeps_the_newest_1000_file_edits(new_story, monkeypatch):
    expect_value(record_file_edit_handler.ROWS_KEPT, 1000)
    monkeypatch.setattr(record_file_edit_handler, "ROWS_KEPT", 3)
    story = new_story(fixture=BuilderStarted)
    for number in range(1, 6):
        scanned_edit(story, "s-1", f"src/part{number}.py")
    story.expect_refusal("file-edit show 1", "no")
    story.expect_refusal("file-edit show 2", "no")
    story.expect_text("file-edit show 3", "path: src/part3.py")
    story.expect_text("file-edit show 5", "path: src/part5.py")


def test_a_request_that_prunes_more_than_ten_file_edits_reads_the_links_once_for_each_side(new_story, monkeypatch):
    story = new_story(fixture=BuilderStarted)
    for number in range(1, 14):
        scanned_edit(story, "s-1", f"src/part{number}.py")
    monkeypatch.setattr(record_file_edit_handler, "ROWS_KEPT", 2)
    scanned_edit(story, "s-1", "src/part14.py")
    reads = {sql: count for sql, count in story.repeated_work.read_texts.items() if "FROM links" in sql}
    story.expect_rows(len(reads) <= 2, all(count == 1 for count in reads.values()), detail=str(reads))
    story.expect_refusal("file-edit show 12", "no")
    story.expect_text("file-edit show 14", "path: src/part14.py")
