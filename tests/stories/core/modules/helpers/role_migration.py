import json

from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.plugins.support.plugin_samples import sample_plugin_folder
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import UserBuilder

WORKERS_MODULE = "journal.suites.coding.workers"
ROLE_KEYS_MIGRATION = 81
MERGER_START = 'helper start journal-merger --brief "Merge the finished workers" --environment main'
RETIRED_REACH = "plugin sample reaches verifiers, which the role migration made helpers"


def agent_row(story, number: int) -> dict:
    return json.loads(story.run(f"agent show {number} --json --environment main", actor=story.user).output_text)


def role_numbers(story, role: str) -> list[int]:
    rows = json.loads(story.run(f"agent list --role {role} --json --limit 50 --environment main", actor=story.user).output_text)["rows"]
    return [row["number"] for row in rows]


def merger_group(story, role: str) -> str:
    rows = json.loads(story.run("agent limits --json --environment main", actor=story.agent).output_text)["rows"]
    profiles = next(row for row in rows if row["key"] == role)["profiles"]
    return next(profile["group"] for profile in profiles if profile["profile"] == "journal-merger")


def plugin_reaching(story, reaches: dict[str, list[str]]) -> None:
    install_runner(story)
    folder = sample_plugin_folder(story.home.folder.parent)
    manifest = json.loads((folder / "journal-plugin.json").read_text())
    (folder / "journal-plugin.json").write_text(json.dumps({**manifest, "reaches": reaches}))
    story.run(f"plugin install {folder} --yes", actor=story.user)


class OldRoleKeys(StoryFixture):
    """Agents stored with the keys from before the helper classes: an ended verifier, an ended reviewer, and a
    running helper started with the merger profile."""

    parent = UserBuilder

    def steps(self, story) -> None:
        for session, role in (("v-1", "verifier"), ("r-1", "reviewer")):
            story.run(f"agent start {session} claude {role} --environment main")
            story.run(f"agent end {role_numbers(story, role)[0]} --environment main", actor=story.user)
        launcher = FakeLauncher.accepting(story.home.socket("launcher"))
        story.run(MERGER_START, actor=story.agent)
        story.run_listeners()
        launcher.drain_requests()
        launcher.server.close()
        story.home.socket("launcher").unlink()

    def expect(self, story) -> None:
        story.expect_text("agent list --role verifier --environment main", "verifier", actor=story.user)


def test_a_verifier_and_a_reviewer_become_helpers_keeping_their_number_and_end(new_story):
    story = new_story(fixture=OldRoleKeys)
    verifiers, reviewers = role_numbers(story, "verifier"), role_numbers(story, "reviewer")
    story.run_migration_again(WORKERS_MODULE, ROLE_KEYS_MIGRATION)
    moved = [agent_row(story, number) for number in (*verifiers, *reviewers)]
    story.expect_rows(role_numbers(story, "verifier") == [], role_numbers(story, "reviewer") == [],
                      all(row["role"] == "helper" and row["ended_at"] for row in moved))
    story.expect_text("event list --json --limit 100", '"verifier"', actor=story.user)


def test_a_helper_with_the_merger_profile_becomes_a_merger_in_the_same_group(new_story):
    story = new_story(fixture=OldRoleKeys)
    before = merger_group(story, "helper")
    story.run_migration_again(WORKERS_MODULE, ROLE_KEYS_MIGRATION)
    story.expect_rows(before == "merger", merger_group(story, "merger") == "merger",
                      all(agent_row(story, number)["profile"] == "journal-merger" for number in role_numbers(story, "merger")),
                      len(role_numbers(story, "merger")) == 1)


def test_the_migration_runs_again_without_writing_a_row_twice(new_story):
    story = new_story(fixture=OldRoleKeys)
    story.run_migration_again(WORKERS_MODULE, ROLE_KEYS_MIGRATION)
    helpers, mergers = role_numbers(story, "helper"), role_numbers(story, "merger")
    story.run_migration_again(WORKERS_MODULE, ROLE_KEYS_MIGRATION)
    story.expect_rows(role_numbers(story, "helper") == helpers, role_numbers(story, "merger") == mergers)


def test_an_interrupted_migration_leaves_both_keys_readable_until_it_runs_again(new_story):
    story = new_story(fixture=OldRoleKeys)
    story.run_migration_again(WORKERS_MODULE, ROLE_KEYS_MIGRATION)
    story.run("agent start v-2 claude verifier --environment main")
    story.expect_rows(agent_row(story, role_numbers(story, "verifier")[0])["role"] == "verifier",
                      agent_row(story, role_numbers(story, "merger")[0])["role"] == "merger")
    story.run_migration_again(WORKERS_MODULE, ROLE_KEYS_MIGRATION)
    story.expect_rows(role_numbers(story, "verifier") == [])


def test_a_plugin_that_reaches_a_retired_role_is_reported(new_story):
    story = new_story(fixture=OldRoleKeys)
    plugin_reaching(story, {"idle": ["verifiers"], "command_starting": ["helpers"]})
    story.run_migration_again(WORKERS_MODULE, ROLE_KEYS_MIGRATION)
    story.expect_rows(RETIRED_REACH in story.system_log_text())


def test_a_plugin_that_reaches_helpers_is_not_reported(new_story):
    story = new_story(fixture=OldRoleKeys)
    plugin_reaching(story, {"command_starting": ["helpers"]})
    story.run_migration_again(WORKERS_MODULE, ROLE_KEYS_MIGRATION)
    story.expect_rows(RETIRED_REACH not in story.system_log_text(), "reaches helpers" not in story.system_log_text())


def test_a_running_merger_keeps_running_when_its_row_moves_at_the_update(new_story):
    story = new_story(fixture=OldRoleKeys)
    merger = next(number for number in role_numbers(story, "helper") if agent_row(story, number)["profile"] == "journal-merger")
    story.run_migration_again(WORKERS_MODULE, ROLE_KEYS_MIGRATION)
    row = agent_row(story, merger)
    story.expect_rows(row["role"] == "merger", not row["ended_at"], row["session"] != "")


def test_after_the_migration_the_old_keys_still_start_an_agent(new_story):
    story = new_story(fixture=OldRoleKeys)
    story.run_migration_again(WORKERS_MODULE, ROLE_KEYS_MIGRATION)
    story.expect_success("agent start v-3 claude verifier --environment main", "role: verifier")
