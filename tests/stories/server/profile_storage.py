from core.modules.agents.testing.fake_launcher import FakeLauncher
import json
import shlex

import pytest

from engine.file.file_access import FileAccess
from engine.errors.refusal import Refusal
from core.modules.profiles.support.profile_files import ProfileFiles
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from server.work.booting_work import BootingWork
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.server_client import server_story
from tests.stories.support.story_checks import expect_value

MODULE = "tests.stories.core.modules.profiles.support.profile_updates:"
SAVE = ["profile", "save", "critic", "--description", "Reads a change", "--body", "Read the diff.", "--reason", "needed"]


class ProfileSession(StoryFixture):
    parent = UserBuilder

    def steps(self, story):
        story.expect_sync_success(MODULE + "ProfileVersionOne")


@pytest.fixture
def profile_story(new_story):
    story = new_story(fixture=ProfileSession)
    with server_story(story, listener_thread_started=False) as server:
        story.profile_server = server
        story.profile_cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        yield story


@pytest.fixture
def changed_profile(profile_story):
    save_registered(profile_story, "--model", "opus")
    return profile_story


def profile_line(story, line):
    return story.profile_server.viewer_line_value(story.profile_cookie, {"window": "profiles.profiles", "environment": "main", "line": line})


def profile_refusal(story, line, reason, window="profiles.profiles"):
    story.steps.append(f"profile refusal {window}: {shlex.join(line)}")
    story.profile_server.expect_viewer_line(story.profile_cookie, {"window": window, "environment": "main", "line": line}, 200, reason)


def profile_row(story, name):
    return next(row for row in profile_line(story, ["profile", "list"])["rows"] if row["name"] == name)


def profile_path(story, name="critic"):
    return story.home.project_folder / ".agents/profiles" / f"{name}.md"


def save_profile_file(story, name, text, folder=".agents/profiles", suffix=".md"):
    path = story.home.project_folder / folder / f"{name}{suffix}"
    path.parent.mkdir(parents=True, exist_ok=True)
    FileAccess.shared().write(path, text)
    story.steps.append(f"profile file {folder}/{name}{suffix}: {text}")
    return path


def change_version(story, version):
    modules = json.loads(FileAccess.shared().read(story.home.module_list))
    FileAccess.shared().write(story.home.module_list, json.dumps([MODULE + version if item.startswith(MODULE) else item for item in modules]))
    code, text = story.synced()
    expect_value(code, 0)
    story.steps.append(f"profile module {version}: {text}")


def save_registered(story, *fields):
    return profile_line(story, ["profile", "save", "module-reader", "--description", "Reads one question", "--body", "Read the files.", "--model", "haiku", *fields])


def boot(story):
    BootingWork().run(story.container)
    story.run_listeners()


def test_an_own_profile_is_written_only_in_the_shared_folder(profile_story):
    story = profile_story
    profile_line(story, [*SAVE, "--program", "codex", "--access", "read-only", "--mcp-tools", "mcp__wiki__search", "--independent"])
    expect_value(profile_path(story).is_file(), True)
    expect_value((story.home.project_folder / ".claude/agents/critic.md").exists(), False)
    expect_value((story.home.project_folder / ".codex/agents/critic.toml").exists(), False)
    row = profile_row(story, "critic")
    expect_value((row["program"], row["access"], row["module"]), ("codex", "read-only", ""))
    expect_value((row["mcp_tools"], row["independent"]), (["mcp__wiki__search"], True))


def test_registered_profiles_are_listed_without_shared_files(profile_story):
    story = profile_story
    expect_value(profile_row(story, "module-reader")["module"], "sample.profile-updates")
    expect_value(profile_path(story, "module-reader").exists(), False)
    types = profile_line(story, ["profile", "list"])["types"]
    expect_value(next(row for row in types if row["key"] == "worker")["access"], "writing")
    expect_value(any(row["key"] == "main" for row in types), False)


def test_only_changed_fields_are_saved_and_other_fields_follow_an_upgrade(changed_profile):
    story = changed_profile
    text = FileAccess.shared().read(profile_path(story, "module-reader"))
    expect_value("description:" in text or "Read the files." in text, False)
    change_version(story, "ProfileVersionTwo")
    row = profile_row(story, "module-reader")
    expect_value((row["description"], row["body"], row["model"]), ("Reads a changed question", "Read the new files.", "opus"))
    expect_value(row["changed"], ["model", "program_models"])
    expect_value(row["program_models"], {"claude": "opus", "codex": "gpt-6.1-sol"})


@pytest.mark.parametrize("body", ["Read our wiki first.", ""], ids=["instructions", "empty"])
def test_a_persons_text_survives_changed_module_text_and_reset(profile_story, body):
    story = profile_story
    save_registered(story, "--body", body)
    expect_value("module-text:" in FileAccess.shared().read(profile_path(story, "module-reader")), True)
    change_version(story, "ProfileVersionTwo")
    row = profile_row(story, "module-reader")
    expect_value((row["body"], row["module_text_changed"]), (body, True))
    profile_line(story, ["profile", "reset", "module-reader"])
    expect_value(profile_row(story, "module-reader")["body"], "Read the new files.")


def test_a_registered_profiles_type_follows_its_module(changed_profile):
    story = changed_profile
    change_version(story, "ProfileWorkerVersion")
    expect_value(profile_row(story, "module-reader")["agent_type"], "worker")


def test_a_withdrawn_profile_keeps_the_change_and_refuses_start(changed_profile):
    story = changed_profile
    change_version(story, "ProfileRemoved")
    expect_value("Its module no longer offers this profile" in profile_row(story, "module-reader")["problem"], True)
    expect_value(profile_path(story, "module-reader").is_file(), True)
    with pytest.raises(Refusal, match="Its module no longer offers") as refused:
        story.container.get(ProfileFiles).effective("module-reader")
    expect_value("journal profile reset" in refused.value.suggestion, True)


def test_a_missing_type_keeps_the_file_and_does_not_stop_sync(profile_story):
    story = profile_story
    change_version(story, "ProfileCustomType")
    profile_line(story, [*SAVE, "--type", "clerk"])
    change_version(story, "ProfileRemoved")
    expect_value("Type: gone" in profile_row(story, "critic")["problem"], True)
    with pytest.raises(Refusal, match="clerk"):
        story.container.get(ProfileFiles).effective("critic")
    expect_value(profile_path(story).is_file(), True)


@pytest.mark.parametrize("line", [SAVE, ["profile", "reset", "module-reader", "--reason", "needed"], ["profile", "remove", "critic", "--reason", "needed"]])
def test_agents_cannot_change_profiles(profile_story, line):
    profile_story.expect_refusal(shlex.join(line), "A person was asked in the dock", actor=profile_story.agent)


@pytest.mark.parametrize("fields,reason", [(["--access", "writing"], "only reads"), (["--type", "main"], "main")])
def test_save_refuses_an_access_or_type_that_cannot_be_a_profile(profile_story, fields, reason):
    profile_refusal(profile_story, [*SAVE, *fields], reason)


def test_a_person_can_save_a_journal_name_but_cannot_change_a_registered_type(profile_story):
    story = profile_story
    profile_line(story, ["profile", "save", "journal-mine", "--description", "My reader", "--body", "Read."])
    profile_refusal(story, ["profile", "save", "module-reader", "--description", "Reads", "--type", "worker"], "its type stays helper")


def test_remove_deletes_an_own_profile_but_registered_profiles_need_reset(profile_story):
    story = profile_story
    profile_line(story, SAVE)
    profile_line(story, ["profile", "remove", "critic"])
    expect_value(profile_path(story).exists(), False)
    profile_refusal(story, ["profile", "remove", "module-reader"], "profile reset")


@pytest.mark.parametrize("text", ["<<<<<<< ours\n=======\n>>>>>>> theirs", "---\nname critic\n---\nRead.", "---\nname: critic\nmodel: opus\n---\nRead."])
def test_an_unreadable_profile_does_not_hide_other_profiles_or_stop_sync(profile_story, text):
    story = profile_story
    save_profile_file(story, "critic", text)
    expect_value("Unreadable" in profile_row(story, "critic")["problem"], True)
    expect_value(profile_row(story, "module-reader")["body"], "Read the files.")
    code, output = story.synced()
    expect_value(code, 0)
    with pytest.raises(Refusal, match="Unreadable"):
        story.container.get(ProfileFiles).effective("critic")


def test_a_missing_text_digest_does_not_crash_an_overlay(profile_story):
    story = profile_story
    save_profile_file(story, "module-reader", "---\nname: module-reader\nmodel: opus\n---\n")
    expect_value(profile_row(story, "module-reader")["model"], "opus")


def test_a_module_cannot_take_over_an_existing_own_profile_name(profile_story):
    story = profile_story
    profile_line(story, SAVE)
    change_version(story, "ProfileNameCollision")
    row = profile_row(story, "critic")
    expect_value((row["body"], "Name taken by a module" in row["problem"]), ("Read the diff.", True))
    with pytest.raises(Refusal, match="Name taken by a module"):
        story.container.get(ProfileFiles).effective("critic")
    profile_line(story, ["profile", "reset", "critic"])
    expect_value(profile_row(story, "critic")["body"], "Read the module instructions.")


@pytest.mark.parametrize("source,suffix,text", [
    (".claude/agents", ".md", "---\nname: critic\ndescription: |\n  Reads changes\n  and their tests\nkind: helper\nmodel: inherit\nindependent: true\ntools: Read, Edit, mcp__wiki__search\n---\nRead the diff.\n"),
    (".codex/agents", ".toml", 'name = "critic"\ndescription = "Reads changes"\nmodel = "inherit"\nsandbox_mode = "read-only"\nindependent = true\nmcp_tools = ["mcp__wiki__search"]\ndeveloper_instructions = "Read the diff."\n'),
])
def test_legacy_profiles_are_copied_without_deletion_and_keep_their_fields(profile_story, source, suffix, text):
    story = profile_story
    original = save_profile_file(story, "critic", text, source, suffix)
    boot(story)
    row = profile_row(story, "critic")
    expect_value(FileAccess.shared().read(original), text)
    expect_value("moved-from:" in FileAccess.shared().read(profile_path(story)), True)
    expect_value((row["agent_type"], row["access"]), ("helper", "read-only"))
    expect_value((row["model"], row["codex_model"]), ("sonnet", "gpt-6.1-sol"))
    expect_value((row["independent"], row["mcp_tools"]), (True, ["mcp__wiki__search"]))
    if suffix == ".md":
        expect_value(row["description"], "Reads changes\nand their tests")
        expect_value("Could write before" in row["notes"], True)


def test_copy_is_idempotent_and_a_changed_original_is_kept_as_a_clash(profile_story):
    story = profile_story
    original = save_profile_file(story, "critic", "---\nname: critic\ndescription: Reads\n---\nRead once.\n", ".claude/agents")
    boot(story)
    modified_at = profile_path(story).stat().st_mtime_ns
    boot(story)
    expect_value(profile_path(story).stat().st_mtime_ns, modified_at)
    profile_line(story, [*SAVE, "--body", "Personal instructions."])
    edited_at = profile_path(story).stat().st_mtime_ns
    boot(story)
    expect_value(profile_path(story).stat().st_mtime_ns, edited_at)
    FileAccess.shared().write(original, "---\nname: critic\ndescription: Reads\n---\nRead twice.\n")
    boot(story)
    expect_value(profile_path(story, "critic.clash").is_file(), True)
    expect_value("Personal instructions." in FileAccess.shared().read(profile_path(story)), True)
    expect_value(any("clash" in note for note in profile_row(story, "critic")["notes"]), True)


def test_a_legacy_registered_name_becomes_only_a_change_file(profile_story):
    story = profile_story
    original = save_profile_file(story, "module-reader", "---\nname: module-reader\ndescription: Reads one question\nmodel: opus\n---\nRead the files.\n", ".claude/agents")
    native_text = FileAccess.shared().read(original)
    boot(story)
    expect_value(FileAccess.shared().read(original), native_text)
    expect_value(profile_row(story, "module-reader")["changed"], ["model"])
    expect_value("Read the files." in FileAccess.shared().read(profile_path(story, "module-reader")), False)


def test_a_read_only_profile_folder_leaves_copy_undone_and_start_continues(profile_story, monkeypatch):
    story = profile_story
    save_profile_file(story, "critic", "---\nname: critic\ndescription: Reads\n---\nRead.\n", ".claude/agents")
    save_file = FileAccess.write
    def refuse_profile_write(files, path, *args, **kwargs):
        if ".agents/profiles" in str(path):
            raise PermissionError("read-only profile folder")
        return save_file(files, path, *args, **kwargs)
    monkeypatch.setattr(FileAccess, "write", refuse_profile_write)
    boot(story)
    expect_value(profile_path(story).exists(), False)
    expect_value(story.system_log_text().count("warning journal Profiles left unchanged: the profile folder is read-only"), 1)
    story.expect_success("profile list")


def test_default_models_are_effective_and_native_profiles_still_publish(profile_story):
    story = profile_story
    profile_line(story, SAVE)
    story.expect_success("setting set journal.core.profiles.model-claude haiku --project", actor=story.user)
    story.expect_success("setting set journal.core.profiles.model-codex gpt-6.1-sol --project", actor=story.user)
    row = profile_row(story, "critic")
    expect_value((row["model"], row["codex_model"]), ("haiku", "gpt-6.1-sol"))
    story.container.get(ProfileFiles).publish()
    native = story.home.project_folder / ".claude/agents/journal-researcher.md"
    expect_value(native.is_file(), True)
    expect_value("tools:" in FileAccess.shared().read(native), False)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    story.run('helper start journal-researcher --model haiku --brief "Read the cart" --environment main', actor=story.agent)
    launcher.server.close()
    expect_value(profile_row(story, "journal-researcher")["uses"], 1)


@pytest.mark.parametrize("line", [SAVE, ["profile", "reset", "module-reader", "--reason", "needed"], ["profile", "remove", "critic", "--reason", "needed"]])
def test_third_party_windows_cannot_change_profiles(profile_story, line):
    profile_refusal(profile_story, line, "may never run profile", "profile-updates.editor")
