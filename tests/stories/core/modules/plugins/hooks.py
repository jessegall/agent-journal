import pytest

import json
import os
import subprocess
from pathlib import Path

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.file_access import FileAccess
from core.base.driver.command_category import CommandCategory
from core.base.driver.command_effect import CommandEffect
from core.modules.plugins.support.login_path import LoginPath
from core.base.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine
from core.testing.expect_reply import expect_reply_allowed, expect_absent_reply_line
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.scanned_edits import scanned_edit
from tests.stories.core.modules.plugins.support.event_stories import event_plugin_story, install_event_plugin
from tests.stories.core.modules.plugins.support.plugin_samples import sample_plugin_folder
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import BuilderStarted

REMOVAL_SAMPLE = HookSamples.shell("rm -rf build", ShellPart("rm", CommandCategory.EDIT, ["-rf", "build"], effects=[CommandEffect.DELETES_FILES]))
LISTING_SAMPLE = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, []))


def installed_story(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.run(f"plugin install {sample_plugin_folder(story.home.folder.parent)} --yes", actor=story.user)
    story.run("setting set journal.core.plugins.hold_window_ms 5000 --project", actor=story.user)
    return story


def test_a_command_the_plugin_holds_and_refuses_is_refused_with_its_reason(new_story):
    story = installed_story(new_story)
    story.expect_hook_refusal("s-1", REMOVAL_SAMPLE, "plugin:")
    story.expect_text(f"agent-line list --agent {story.agent.id}", "[plugin sample] no deletes here", actor=story.agent)


def test_a_command_the_plugin_allows_goes_through(new_story):
    story = installed_story(new_story)
    story.expect_hook_allowed("s-1", LISTING_SAMPLE)


@pytest.fixture
def prepared_install(new_story):
    return installed_story(new_story)



@pytest.mark.parametrize("name, rows, notice", [
    ("a.py", None, "[plugin sample] a.py was judged"),
    ("b.py", [{"line_type": "add", "line": 1, "text": "total = 0"}], "[plugin sample] b.py wrote total = 0"),
], ids=["after-the-reply", "with-the-lines-it-wrote"])
def test_a_file_edit_reaches_the_plugin_and_its_line_reaches_the_agent_at_the_next_hook(prepared_install, name, rows, notice):
    story = prepared_install
    scanned_edit(story, "s-1", name, **({} if rows is None else {"rows": rows}))
    story.run_listeners()
    expect_plugin_notice(story, LISTING_SAMPLE, notice)


def test_a_line_in_the_plugins_queue_reaches_the_agent_once(new_story):
    story = installed_story(new_story)
    queue = story.home.folder / "plugin-data" / "sample" / "queue"
    queue.mkdir(parents=True, exist_ok=True)
    (queue / "1.json").write_text(json.dumps({"v": 1, "env": "main", "tell": "two sins in b.py"}))
    expect_plugin_notice(story, LISTING_SAMPLE, "[plugin sample] two sins in b.py")
    story.expect_absent_hook_line("s-1", LISTING_SAMPLE, "two sins in b.py")


def test_a_changed_plugin_file_switches_the_plugin_off_until_the_user_switches_it_on(new_story):
    story = installed_story(new_story)
    program = story.home.folder / "plugins" / "sample" / "run.sh"
    program.write_text(program.read_text() + "\n")
    expect_plugin_notice(story, REMOVAL_SAMPLE, "[plugin sample] switched off: its files changed since it was installed")
    story.expect_text("plugin list", "sample", "off", actor=story.user)
    story.run("plugin enable sample", actor=story.user)
    story.expect_hook_refusal("s-1", REMOVAL_SAMPLE, "plugin:")
    story.expect_text(f"agent-line list --agent {story.agent.id}", "[plugin sample] no deletes here", actor=story.agent)


def test_a_switched_off_plugin_hears_nothing(new_story):
    story = installed_story(new_story)
    story.run("plugin disable sample", actor=story.user)
    story.expect_hook_allowed("s-1", REMOVAL_SAMPLE)


def test_a_queue_file_that_is_not_json_is_set_aside_as_the_plugins_fault_and_the_next_line_still_arrives(new_story):
    story = installed_story(new_story)
    queue = story.home.folder / "plugin-data" / "sample" / "queue"
    queue.mkdir(parents=True, exist_ok=True)
    (queue / "1.json").write_text("{not json")
    story.hook("s-1", LISTING_SAMPLE)
    story.run_listeners()
    story.expect_text("plugin list", "last fault: its queue file 1.json is not JSON", actor=story.user)
    (queue / "2.json").write_text(json.dumps({"v": 1, "env": "main", "tell": "two sins in c.py"}))
    expect_plugin_notice(story, LISTING_SAMPLE, "[plugin sample] two sins in c.py")


def test_a_line_reserved_by_a_hook_that_never_committed_is_offered_again(new_story):
    story = installed_story(new_story)
    queue = story.home.folder / "plugin-data" / "sample" / "queue"
    queue.mkdir(parents=True, exist_ok=True)
    reserved_file = queue / "1.json.rolled-back.reserved"
    reserved_file.write_text(json.dumps({"v": 1, "env": "main", "tell": "three sins in d.py"}))
    os.utime(reserved_file, (0, 0))
    expect_plugin_notice(story, LISTING_SAMPLE, "[plugin sample] three sins in d.py")


def test_a_line_whose_hook_committed_is_never_offered_again_though_its_file_waits_to_be_deleted(new_story):
    story = installed_story(new_story)
    queue = story.home.folder / "plugin-data" / "sample" / "queue"
    queue.mkdir(parents=True, exist_ok=True)
    (queue / "1.json").write_text(json.dumps({"v": 1, "env": "main", "tell": "five sins in f.py"}))
    expect_plugin_notice(story, LISTING_SAMPLE, "[plugin sample] five sins in f.py")
    for reserved_file in queue.glob("*.reserved"):
        os.utime(reserved_file, (0, 0))
    story.expect_absent_hook_line("s-1", LISTING_SAMPLE, "five sins in f.py")


def test_a_line_read_by_a_hook_is_not_read_again_before_it_is_deleted(new_story):
    story = installed_story(new_story)
    queue = story.home.folder / "plugin-data" / "sample" / "queue"
    queue.mkdir(parents=True, exist_ok=True)
    (queue / "1.json").write_text(json.dumps({"v": 1, "env": "main", "tell": "four sins in e.py"}))
    expect_plugin_notice(story, LISTING_SAMPLE, "[plugin sample] four sins in e.py")
    story.expect_absent_hook_line("s-1", LISTING_SAMPLE, "four sins in e.py")
    story.run_listeners()
    story.expect_rows(not any(queue.iterdir()))


def test_the_starts_of_one_hook_read_the_login_path_once(new_story, monkeypatch):
    story = install_runner(event_plugin_story(new_story, program="see.sh", hears=["command_starting"], holds=["command_starting"]))
    install_event_plugin(story, program="see.sh", hears=["command_starting"], holds=["command_starting"], name="second")
    story.run("setting set journal.core.plugins.hold_window_ms 5000 --project", actor=story.user)
    login_path = LoginPath(story.home)
    login_path.file.parent.mkdir(parents=True, exist_ok=True)
    login_path.file.write_text("/usr/bin:/bin")
    reads = read_counter(monkeypatch, login_path.file)
    starts = start_counter(monkeypatch, "see.sh")
    line = HookSamples.shell("ls && pwd", *(ShellPart(name, CommandCategory.READ, []) for name in ("ls", "pwd")))
    story.expect_hook_allowed("s-1", line)
    story.expect_rows(sorted(starts) == ["events", "events", "second", "second"], reads == [login_path.file.resolve()])


def test_a_hook_starts_no_script_for_an_edit_the_plugin_hears_and_does_not_hold(new_story, monkeypatch):
    story = install_runner(event_plugin_story(new_story, program="see.sh", hears=["file_edited"]))
    starts = start_counter(monkeypatch, "see.sh")
    scanned_edit(story, "s-1", "a.py")
    story.run_listeners()
    edit_starts = list(starts)
    story.expect_hook_allowed("s-1", LISTING_SAMPLE)
    story.expect_rows(edit_starts == ["events"], starts == edit_starts)

def read_counter(monkeypatch, file: Path) -> list[Path]:
    reads: list[Path] = []
    read = FileAccess.binary

    def counted(self, path):
        reads.extend([Path(path).resolve()] if Path(path).resolve() == file.resolve() else [])
        return read(self, path)

    monkeypatch.setattr(FileAccess, "binary", counted)
    return reads


def start_counter(monkeypatch, program: str) -> list[str]:
    starts: list[str] = []
    popen = subprocess.Popen

    def counted(arguments, *call_arguments, **options):
        starts.extend([options["env"]["JOURNAL_PLUGIN"]] if str(arguments[0]).endswith(program) else [])
        return popen(arguments, *call_arguments, **options)

    monkeypatch.setattr(subprocess, "Popen", counted)
    return starts


def expect_plugin_notice(story, sample, text):
    reply = story.hook("s-1", sample)
    expect_reply_allowed(reply)
    expect_absent_reply_line(reply, text)
    saved = next((line for line in story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id).all_rows() if text in line.text), None)
    assert saved is not None, [(line.source, line.text) for line in story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id).all_rows()]
    story.expect_text(f"agent-line show {saved.id}", text, actor=story.agent)
    next_reply = story.hook("s-1", LISTING_SAMPLE)
    story.expect_rows(any(text in line for line in next_reply.lines), not any(f"agent-line:{saved.id}" in line for line in next_reply.lines))
    story.expect_absent_hook_line("s-1", LISTING_SAMPLE, text)
