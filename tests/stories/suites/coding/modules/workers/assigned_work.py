import json

from engine.actor.actor import Actor
from suites.coding.modules.workers.support.available_work import AvailableWork
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.plan_assignment import story_with_two_workers
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.stories.suites.coding.modules.workers.support.phase_steps import PLAN_DISPATCH, dispatched_story_worker, planned_story, single_task_worker, unplanned_worker
from tests.stories.suites.coding.support.main_controls_fixture import scope_line

RECEIPT = 'task make "Print the receipt" --brief "Print it" --environment main'


def startable_ids(story, worker: Actor) -> list[int]:
    return [task["id"] for task in json.loads(story.run("worker status --json", actor=worker).output_text)["startable"]]


def delegatable(story) -> tuple[int, ...]:
    with scope_line(story):
        return story.container.get(AvailableWork).answer(story.agent.id).delegatable












def test_available_work_lists_only_unassigned_tasks(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.expect_success(RECEIPT, actor=story.agent)
    story.expect_success(f"task assign 2 --to {agent_number(story, story.agent.id)}", actor=story.agent)
    story.expect_rows(delegatable(story) == tuple([1]), detail=str(delegatable(story)))


