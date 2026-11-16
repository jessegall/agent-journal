import json
from dataclasses import dataclass

from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.helpers.support.old_role_seeds import OldRoleAgentSeed
from tests.stories.core.support.seeds.project_seeds import AgentActorSeed
from tests.stories.core.modules.plugins.support.plugin_samples import sample_plugin_folder
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import UserBuilder

WORKERS_MODULE = "journal.suites.coding.workers"
ROLE_KEYS_MIGRATION = 84


@dataclass(frozen=True)
class StoredAgent:
    """The stored fields of one agent row a migration story checks."""

    role: str
    profile: str
    session: str
    ended_at: str | None


def agent_row(story, agent_id: int) -> StoredAgent:
    rows = json.loads(story.run("agent list --json --limit 50 --environment main", actor=story.user).output_text)["rows"]
    row = next(row for row in rows if row["id"] == agent_id)
    return StoredAgent(row["role"], row["profile"], row["session"], row["ended_at"])


def role_numbers(story, role: str) -> list[int]:
    rows = json.loads(story.run(f"agent list --role {role} --json --limit 50 --environment main", actor=story.user).output_text)["rows"]
    return [row["id"] for row in rows]


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
    running helper with the merger profile."""

    parent = UserBuilder

    def steps(self, story) -> None:
        story.use_fixture_environment("main")
        story.seed(AgentActorSeed, 3)
        story.seed(OldRoleAgentSeed, 3)

    def expect(self, story) -> None:
        story.expect_text("agent list --role verifier --environment main", "verifier", actor=story.user)


def test_a_verifier_and_a_reviewer_become_helpers_keeping_their_number_and_end(new_story):
    story = new_story(fixture=OldRoleKeys)
    verifiers, reviewers = role_numbers(story, "verifier"), role_numbers(story, "reviewer")
    story.rerun_migration(WORKERS_MODULE, ROLE_KEYS_MIGRATION)
    moved = [agent_row(story, number) for number in (*verifiers, *reviewers)]
    story.expect_rows(role_numbers(story, "verifier") == [], role_numbers(story, "reviewer") == [],
                      all(row.role == "helper" and row.ended_at for row in moved))


def test_a_helper_with_the_merger_profile_becomes_a_merger_in_the_same_group(new_story):
    story = new_story(fixture=OldRoleKeys)
    story.rerun_migration(WORKERS_MODULE, ROLE_KEYS_MIGRATION)
    story.expect_rows(merger_group(story, "merger") == "merger",
                      all(agent_row(story, number).profile == "journal-merger" for number in role_numbers(story, "merger")),
                      len(role_numbers(story, "merger")) == 1)


def test_the_migration_runs_again_without_writing_a_row_twice(new_story):
    story = new_story(fixture=OldRoleKeys)
    story.rerun_migration(WORKERS_MODULE, ROLE_KEYS_MIGRATION)
    helpers, mergers = role_numbers(story, "helper"), role_numbers(story, "merger")
    story.rerun_migration(WORKERS_MODULE, ROLE_KEYS_MIGRATION)
    story.expect_rows(role_numbers(story, "helper") == helpers, role_numbers(story, "merger") == mergers)


def test_an_interrupted_migration_leaves_both_keys_readable_until_it_runs_again(new_story):
    story = new_story(fixture=OldRoleKeys)
    story.rerun_migration(WORKERS_MODULE, ROLE_KEYS_MIGRATION)
    story.use_fixture_environment("main")
    actor_ids = story.seed(AgentActorSeed, 1, name="late verifier")
    story.seed(OldRoleAgentSeed, 1, id=actor_ids[0], actor_id=actor_ids[0], session="late-verifier")
    story.expect_rows(agent_row(story, role_numbers(story, "verifier")[0]).role == "verifier",
                      agent_row(story, role_numbers(story, "merger")[0]).role == "merger")
    story.rerun_migration(WORKERS_MODULE, ROLE_KEYS_MIGRATION)
    story.expect_rows(role_numbers(story, "verifier") == [])


def test_a_plugin_that_reaches_helpers_stays_on_after_the_migration(new_story):
    story = new_story(fixture=OldRoleKeys)
    plugin_reaching(story, {"command_starting": ["helpers"]})
    story.rerun_migration(WORKERS_MODULE, ROLE_KEYS_MIGRATION)
    story.expect_text("plugin list", "sample", "on", actor=story.user)


def test_a_running_merger_keeps_running_when_its_row_moves_at_the_update(new_story):
    story = new_story(fixture=OldRoleKeys)
    merger = next(number for number in role_numbers(story, "helper") if agent_row(story, number).profile == "journal-merger")
    story.rerun_migration(WORKERS_MODULE, ROLE_KEYS_MIGRATION)
    row = agent_row(story, merger)
    story.expect_rows(row.role == "merger", not row.ended_at, row.session != "")
