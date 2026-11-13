import json
from collections import Counter

from engine.actor.actor import Actor
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.assign_rules.support.rule_steps import ENVIRONMENT, SonnetWorkerAndFreeTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker

KIND_RULE = f"assign-rule make --target model --program claude --model sonnet --condition any {ENVIRONMENT}"


def new_task(story: Story, title: str) -> int:
    return story.new_row_id(f'task make "{title}" {ENVIRONMENT}', actor=story.agent)


def second_worker(story: Story, *task_ids: int) -> Actor:
    tasks = " ".join(str(task_id) for task_id in task_ids)
    return dispatched_worker(story, f'worker dispatch --test-command python=pytest --model sonnet --fresh "a second worker of the kind" {tasks}')


def recorded_actors(story: Story, task_ids: list[int]) -> list[int]:
    outcome = story.run(f"assign-decision record {' '.join(map(str, task_ids))} --json {ENVIRONMENT}", actor=story.user)
    return [json.loads(line)["actor_id"] for line in outcome.output_text.splitlines()]


class TwoSonnetWorkers(StoryFixture):
    """Two workers on claude sonnet with a cut worktree, each holding one task: story.helper holds task 1, the
    second, dispatched later, holds task 2."""

    parent = SonnetWorkerAndFreeTask

    def steps(self, story: Story) -> None:
        second_worker(story, 2)
        story.run(KIND_RULE, actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_text("assign-rule list --environment main", "model", actor=story.user)


def test_a_kind_gives_the_task_to_the_worker_with_the_fewest_tasks_then_the_longest_wait(new_story):
    story = new_story(fixture=TwoSonnetWorkers)
    busy = second_worker(story, new_task(story, "Third"), new_task(story, "Fourth"))
    free = new_task(story, "Fifth")
    actors = recorded_actors(story, [free])
    story.expect_rows(actors == [story.helper.id], busy.id not in actors, detail=str(actors))


def test_ten_tasks_in_one_step_are_spread_five_and_five(new_story):
    story = new_story(fixture=TwoSonnetWorkers)
    tasks = [new_task(story, f"Batch {number}") for number in range(10)]
    split = Counter(recorded_actors(story, tasks))
    story.expect_rows(sorted(split.values()) == [5, 5], story.helper.id in split, detail=str(split))
