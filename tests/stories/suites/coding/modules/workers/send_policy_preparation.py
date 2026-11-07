from tests.stories.core.modules.agents.agent_kind_controls import stopped_worker, viewer_options
from tests.stories.suites.coding.modules.workers.support.program_split import split_story, split_viewer
from tests.stories.support.story_checks import expect_value


def worktree_rows(story) -> str:
    return story.run("worker-worktree list --json", actor=story.agent).output_text


def task_rows(story) -> str:
    return story.run("task list --json", actor=story.agent).output_text


def test_s55_refused_send_has_no_preparation_effects(split_story, split_viewer):
    worker, launcher = stopped_worker(split_story)
    viewer_options(split_viewer, "worker allow_resume=off")
    before = (worktree_rows(split_story), task_rows(split_story))
    split_story.expect_refusal(f'worker send {worker.id} "go on"', "may not resume", actor=split_story.agent)
    expect_value((worktree_rows(split_story), task_rows(split_story)), before)


def test_s55_target_environment_controls_send(split_story, split_viewer):
    worker, launcher = stopped_worker(split_story)
    viewer_options(split_viewer, "worker allowed_providers=codex")
    split_story.expect_refusal(f'worker send {worker.id} "go on" --environment main', "worker may not use claude", actor=split_story.agent)
