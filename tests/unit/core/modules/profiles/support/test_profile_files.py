from dataclasses import replace
from types import SimpleNamespace

import pytest

from engine.enums.access import Access
from engine.errors.refusal import Refusal
from engine.journal.journal_home import JournalHome
from engine.profile.agent_profile import AgentProfile
from engine.text.text_digest import TextDigest
from core.modules.profiles.support.profile_fields import ProfileFields
from core.modules.profiles.support.profile_files import PROFILE_FOLDER, ProfileFiles
from core.modules.profiles.support.profile_problem import ProfileProblem

MODULE_READER = AgentProfile("module-reader", description="Reads a question", body="Read the files.", agent_type="helper", module="sample.profile-updates")
TYPES = {"helper": Access.READ, "worker": Access.WRITING}


class Types:
    """The helper types a registry offers: their keys and the access each allows."""

    def startable(self):
        return [SimpleNamespace(key=key) for key in TYPES]

    def find(self, key: str):
        return SimpleNamespace(access=TYPES[key], label=key)


class Registry:
    """A registry that offers the given module profiles."""

    def __init__(self, *profiles: AgentProfile) -> None:
        self.profiles = [SimpleNamespace(profile=profile) for profile in profiles]

    def helper_type_book(self) -> Types:
        return Types()


def files(tmp_path, *profiles: AgentProfile) -> ProfileFiles:
    return ProfileFiles(JournalHome(tmp_path / ".journal"), SimpleNamespace(), Registry(*profiles), TextDigest(), SimpleNamespace(all=lambda: []))


def own(tmp_path, name: str, text: str):
    path = tmp_path / PROFILE_FOLDER / f"{name}.md"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)
    return path


def test_an_own_profile_is_written_only_in_the_shared_folder(tmp_path):
    profiles = files(tmp_path)
    profiles.save(AgentProfile("critic", description="Reads a change", body="Read the diff.", agent_type="helper", program="codex"))
    assert (tmp_path / PROFILE_FOLDER / "critic.md").is_file()
    assert not (tmp_path / ".claude/agents/critic.md").exists() and not (tmp_path / ".codex/agents/critic.toml").exists()
    assert profiles.row("critic").program == "codex"


def test_a_module_profile_is_listed_with_no_file_of_its_own(tmp_path):
    profiles = files(tmp_path, MODULE_READER)
    assert [row.name for row in profiles.listed()] == ["module-reader"]
    assert not (tmp_path / PROFILE_FOLDER / "module-reader.md").exists()


def test_only_changed_fields_are_saved_and_the_rest_follows_the_module(tmp_path):
    files(tmp_path, MODULE_READER).save_changes(MODULE_READER, replace(MODULE_READER, model="opus"))
    upgraded = replace(MODULE_READER, description="Reads a changed question", body="Read the new files.")
    row = files(tmp_path, upgraded).row("module-reader")
    assert (row.description, row.body, row.model, row.changed) == ("Reads a changed question", "Read the new files.", "opus", ("model",))


def test_a_persons_text_survives_changed_module_text_and_reset_brings_the_module_text_back(tmp_path):
    files(tmp_path, MODULE_READER).save_changes(MODULE_READER, replace(MODULE_READER, body="Read our wiki first."))
    upgraded = replace(MODULE_READER, body="Read the new files.")
    row = files(tmp_path, upgraded).row("module-reader")
    assert (row.body, row.module_text_changed) == ("Read our wiki first.", True)
    files(tmp_path, upgraded).reset("module-reader")
    assert files(tmp_path, upgraded).row("module-reader").body == "Read the new files."


def test_a_module_profile_whose_type_changed_follows_its_module(tmp_path):
    files(tmp_path, MODULE_READER).save_changes(MODULE_READER, replace(MODULE_READER, model="opus"))
    assert files(tmp_path, replace(MODULE_READER, agent_type="worker")).row("module-reader").agent_type == "worker"


def test_a_withdrawn_profile_keeps_its_change_file_and_refuses_to_start(tmp_path):
    files(tmp_path, MODULE_READER).save_changes(MODULE_READER, replace(MODULE_READER, model="opus"))
    row = files(tmp_path).row("module-reader")
    assert isinstance(row, ProfileProblem) and "Its module no longer offers this profile" in row.problem
    with pytest.raises(Refusal, match="Its module no longer offers") as refused:
        files(tmp_path).effective("module-reader")
    assert "journal profile reset" in refused.value.suggestion
    assert (tmp_path / PROFILE_FOLDER / "module-reader.md").is_file()


def test_a_profile_of_a_type_that_is_gone_keeps_its_file_and_refuses_to_start(tmp_path):
    files(tmp_path).save_fields(ProfileFields({"description": "Reads a change"}, "critic", "clerk"))
    assert "Type: gone" in files(tmp_path).row("critic").problem
    with pytest.raises(Refusal, match="clerk"):
        files(tmp_path).effective("critic")


def test_a_writing_access_on_a_type_that_only_reads_is_a_problem(tmp_path):
    row = files(tmp_path).checked_type(AgentProfile("critic", agent_type="helper", access=Access.WRITING))
    assert "only reads" in row.problem


def test_remove_deletes_an_own_profile_and_refuses_a_module_profile(tmp_path):
    profiles = files(tmp_path, MODULE_READER)
    profiles.save(AgentProfile("critic", agent_type="helper"))
    profiles.remove("critic")
    assert not (tmp_path / PROFILE_FOLDER / "critic.md").exists()
    with pytest.raises(Refusal, match="comes with a module") as refused:
        profiles.remove("module-reader")
    assert "profile reset" in refused.value.suggestion


@pytest.mark.parametrize("text", ["<<<<<<< ours\n=======\n>>>>>>> theirs", "---\nname critic\n---\nRead.", "---\nname: critic\nmodel: opus\n---\nRead."])
def test_an_unreadable_profile_is_a_problem_and_hides_no_other_profile(tmp_path, text):
    own(tmp_path, "critic", text)
    profiles = files(tmp_path, MODULE_READER)
    rows = {row.name: row for row in profiles.listed()}
    assert "Unreadable" in rows["critic"].problem and rows["module-reader"].body == "Read the files."
    with pytest.raises(Refusal, match="Unreadable"):
        profiles.effective("critic")


def test_a_change_file_with_no_text_digest_still_overlays_the_module_profile(tmp_path):
    own(tmp_path, "module-reader", "---\nname: module-reader\nmodel: opus\n---\n")
    assert files(tmp_path, MODULE_READER).row("module-reader").model == "opus"


def test_an_own_profile_of_a_name_a_module_takes_is_a_problem(tmp_path):
    files(tmp_path).save(AgentProfile("module-reader", agent_type="helper", body="Mine."))
    assert files(tmp_path, MODULE_READER).row("module-reader").problem == "Name taken by a module"


def test_a_profile_file_names_the_default_states_it_removes(tmp_path):
    own(tmp_path, "module-reader", "---\nname: module-reader\nremoved-states: [\"workers.worker-log-due\"]\n---\n")
    assert files(tmp_path, MODULE_READER).row("module-reader").removed_states == tuple(["workers.worker-log-due"])
