import json
from pathlib import Path

from core.modules.agents.models.agent import Agent
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OrchestratorWithPerson
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.support.main_controls_fixture import person_viewer
from tests.stories.suites.coding.support.settings_modal import Modal
from tests.stories.support.story_checks import expect_value

MERGE_HOOKS = "journal.suites.coding.workers.merge-hooks"
HELPER_TYPES = "helper-type"


def test_the_merge_hooks_set_on_a_profile_run_once_after_its_worker_is_merged_and_a_failing_one_is_told(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    profile = story.row(Agent, worker.id).profile
    hooks = [f'{profile}: echo "$JOURNAL_COMMIT_AFTER" >> hooked.txt', f"{profile}: exit 3", "another-profile: echo other >> other.txt"]
    with person_viewer(story) as viewer:
        modal = Modal(viewer)
        modal.save({MERGE_HOOKS: json.dumps(hooks)}, HELPER_TYPES)
        expect_value(json.loads(modal.value(HELPER_TYPES, MERGE_HOOKS)), hooks)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    story.run_listeners()
    executed = Path(repository.folder, "hooked.txt").read_text().splitlines()
    expect_value(len(executed), 1)
    expect_value(bool(executed[0]), True)
    expect_value(Path(repository.folder, "other.txt").exists(), False)
    story.expect_text("worker-worktree show 1", "state: removed", actor=story.agent)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "merge hook", "exit 3", actor=story.agent)
