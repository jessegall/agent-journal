from core.base.actor import CORE_ACTOR_ID
from core.base.change.event_log import EventLog
from core.base.database.database import Database
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.profiles.support.shipped_profiles import SHIPPED_PROFILES
from core.testing.hook_samples import HookSamples
from server.booting_work import BootingWork
from tests.stories.core.support.coding_fixtures import BuilderWithUser

SAVE_PROFILE = 'profile save critic --description "Reads a change and says what is wrong" --body "Read the diff."'


def agents_folder(story):
    return story.home.project_folder / ".claude" / "agents"


def saved_profile_story(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(SAVE_PROFILE, actor=story.user)
    return story


def test_the_journal_writes_its_own_profiles_at_every_start_and_keeps_a_saved_one(new_story):
    story = saved_profile_story(new_story)
    (agents_folder(story) / "journal-gone.md").parent.mkdir(parents=True, exist_ok=True)
    (agents_folder(story) / "journal-gone.md").write_text("an old profile")
    story.container.get(ProfileFiles).publish()
    names = {path.stem for path in agents_folder(story).glob("*.md")}
    assert names == {*(profile.name for profile in SHIPPED_PROFILES), "critic"}


def test_a_module_sync_writes_the_journals_own_profiles(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run_listeners()
    with story.container.get(Database).transaction():
        story.container.get(EventLog).write_registry_sync(CORE_ACTOR_ID, "a new fingerprint", story.clock.timestamp().text)
    story.run_listeners()
    assert (agents_folder(story) / "journal-senior.md").is_file()


def test_the_journals_start_writes_its_own_profiles(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run_listeners()
    BootingWork().run(story.container)
    story.run_listeners()
    assert (agents_folder(story) / "journal-senior.md").is_file()


def test_a_shipped_profile_takes_its_model_from_the_setting_unless_it_names_its_own(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success("setting set journal.core.profiles.model-claude haiku --project", actor=story.user)
    story.container.get(ProfileFiles).publish()
    assert "model: haiku" in (agents_folder(story) / "journal-researcher.md").read_text()
    assert "model: opus" in (agents_folder(story) / "journal-senior.md").read_text()


def test_a_saved_profile_is_listed_whether_a_person_or_an_agent_saved_it(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(SAVE_PROFILE, "saved critic in .claude/agents/critic.md", actor=story.agent)
    story.expect_success(SAVE_PROFILE, "saved critic in .claude/agents/critic.md", actor=story.user)
    story.expect_text("profile list", "critic  subagent  -  used 0", actor=story.user)


def test_a_bad_name_a_bad_type_or_no_description_is_refused(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_refusal('profile save "no good" --description "x"', "no good cannot name a profile", actor=story.user)
    story.expect_refusal('profile save critic --description "x" --type boss', "a profile is a subagent or a worker, not boss", actor=story.user)
    story.expect_refusal("profile save critic", "a profile needs a description", actor=story.user)


def test_codex_gets_a_toml_only_where_it_has_a_folder(new_story):
    story = saved_profile_story(new_story)
    assert not (story.home.project_folder / ".codex" / "agents" / "critic.toml").exists()
    (story.home.project_folder / ".codex").mkdir()
    story.expect_success(SAVE_PROFILE, actor=story.user)
    assert 'sandbox_mode = "read-only"' in (story.home.project_folder / ".codex" / "agents" / "critic.toml").read_text()


def test_starting_a_subagent_under_a_profile_counts_its_use(new_story):
    story = saved_profile_story(new_story)
    start = HookSamples.subagent().with_raw({"tool_input": {"model": "haiku", "description": "Read the cart", "prompt": "Find where totals are counted", "subagent_type": "critic"}})
    story.hook("s-1", start)
    story.expect_text("profile list", "critic  subagent  -  used 1", actor=story.user)


def test_a_person_cannot_save_a_profile_under_a_shipped_name(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_refusal('profile save journal-mine --description "Mine" --body "Read."', "a profile starting with journal- is reserved", actor=story.user)
