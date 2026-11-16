import json
from pathlib import Path

from core.modules.processes.models.process import Process
from suites.coding.modules.workers.support.merge_hook_line import MergeHookLine
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner
from core.modules.agents.models.agent import Agent
from tests.stories.core.support.coding_fixtures import OrchestratorWithPerson
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.support.main_controls_fixture import person_viewer
from tests.stories.suites.coding.support.settings_modal import Modal
from tests.stories.support.story_checks import expect_value

MERGE_HOOKS = "journal.suites.coding.workers.merge-hooks"
HELPER_TYPES = "helper-type"


def test_the_merge_hooks_set_on_a_profile_start_as_processes_after_its_worker_is_merged_and_a_failing_one_is_told(new_story):
    story = install_runner(new_story(fixture=OrchestratorWithPerson))
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    profile = story.row(Agent, worker.id).profile
    hooks = [f'{profile}: echo "$JOURNAL_COMMIT_AFTER" >> hooked.txt', f"{profile}: exit 3", "another-profile: echo other >> other.txt"]
    with person_viewer(story) as viewer:
        modal = Modal(viewer)
        modal.save({MERGE_HOOKS: json.dumps(hooks)}, HELPER_TYPES)
        expect_value(modal.value(HELPER_TYPES, MERGE_HOOKS), hooks)
    story.expect_success(f"worker merge --wait {worker.id}", actor=story.agent)
    story.run_listeners()
    hooks_run = [process for process in story.story_rows(Process) if process.is_merge_hook]
    expect_value([MergeHookLine.hook(process.line) for process in hooks_run], [f'echo "$JOURNAL_COMMIT_AFTER" >> hooked.txt', "exit 3"])
    expect_value({process.owner_agent_id for process in hooks_run}, {worker.id})
    expect_value(Path(repository.folder, "hooked.txt").exists(), False)
    expect_value(Path(repository.folder, "other.txt").exists(), False)
    story.expect_absent("process feed --json", "hooked.txt", actor=story.user)
    story.expect_text("process list --columns id,line --environment main", "hooked.txt", actor=story.user)
    end_run(story, hooks_run[0], "")
    story.run_listeners()
    story.expect_absent(f"agent-line list --agent {story.agent.id}", "merge hook", actor=story.agent)
    end_run(story, hooks_run[1], "", exit_code=3)
    story.run_listeners()
    story.expect_text("worker-worktree show 1", "state: removed", actor=story.agent)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "merge hook", "exit 3", actor=story.agent)
