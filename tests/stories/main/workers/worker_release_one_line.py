from journal.events.rows.released_tasks import ReleasedTasks
from journal.features.tasks.states.ready import Ready
from journal.features.tasks.tasks_nudges import TasksNudges
from journal.features.workers.workers_options import BUILDER_MODE
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import story
from tests.stories.fixtures.worker.plan_worker import PlanWorker


@story(PlanWorker, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_releasing_a_worker_that_held_a_plan_names_all_its_tasks_in_one_line_and_none_alone(story):
    worker = story.agents.workers.first()
    number = worker.number
    story.agent_runs(story.agents.subject, f"worker stop {worker}")
    result = story.agent_runs(story.agents.subject, f"worker release {worker}")
    released = ReleasedTasks(number, (story.tasks.first, story.tasks.second), story.plans.first)
    result.expect_agent_told(story.agents.subject, TasksNudges.TASKS_RELEASED, tasks=released.subject(), worker=number, them="them")
    result.expect_agent_not_told(story.agents.subject, TasksNudges.TASK_REOPENED)
    story.expect_stack(story.agents.subject, Ready)
