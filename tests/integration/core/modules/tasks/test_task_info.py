from pathlib import Path

from tests.stories.support.story_checks import expect_value_with


def test_the_task_and_worker_skills_tell_a_delegating_agent_to_read_task_info_and_name_the_least_expensive_model_that_fits():
    source = Path(__file__).resolve().parents[6] / "src"
    tasks = (source / "core/modules/tasks/skills/journal-tasks/SKILL.md").read_text()
    workers = (source / "suites/coding/modules/workers/skills/journal-dispatching-workers/SKILL.md").read_text()
    expect_value_with(tasks, "journal task info <n>")
    expect_value_with(workers, "journal task info <n>")
    expect_value_with(workers, "chooses the least expensive model that reliably fits the work")
    expect_value_with(workers, "never runs on the fast tier")
