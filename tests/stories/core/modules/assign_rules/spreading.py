import json
from collections import Counter

from engine.actor.actor import Actor
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.assign_rules.support.rule_steps import ENVIRONMENT
from tests.stories.core.support.coding_fixtures import OrchestratorWithPerson
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment

KIND_RULE = f"assign-rule make --target model --program claude --model sonnet --condition any {ENVIRONMENT}"


def new_task(story: Story, title: str) -> int:
    return story.new_row_id(f'task make "{title}" {ENVIRONMENT}', actor=story.agent)


def first_sonnet_worker(story: Story, *task_ids: int) -> Actor:
    return dispatched_worker(story, f"worker dispatch --test-command python=pytest --model sonnet {' '.join(map(str, task_ids))}")


def sonnet_worker(story: Story, *task_ids: int) -> Actor:
    return dispatched_worker(story, f"worker dispatch --test-command python=pytest --model sonnet --fresh 'one more worker of the kind' {' '.join(map(str, task_ids))}")


def recorded_actors(story: Story, task_ids: list[int]) -> list[int]:
    outcome = story.run(f"assign-decision record {' '.join(map(str, task_ids))} --json {ENVIRONMENT}", actor=story.user)
    return [json.loads(line)["actor_id"] for line in outcome.output_text.splitlines()]


class TwoSonnetWorkers(StoryFixture):
    """Two workers on claude sonnet with a cut worktree, each holding one task, and Ada's rule for the kind:
    story.helper holds task 1, the second worker task 2."""

    parent = OrchestratorWithPerson

    def steps(self, story: Story) -> None:
        repository_environment(story)
        second_task = new_task(story, "Second")
        story.helper = first_sonnet_worker(story, 1)
        sonnet_worker(story, second_task)
        story.run(KIND_RULE, actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_text("assign-rule list --environment main", "model", actor=story.user)


class BusyFirstSonnetWorker(StoryFixture):
    """Two workers on claude sonnet and Ada's rule for the kind: story.helper, dispatched first, holds tasks 1 and 2,
    the second worker task 3."""

    parent = OrchestratorWithPerson

    def steps(self, story: Story) -> None:
        repository_environment(story)
        tasks = [new_task(story, title) for title in ("Second", "Third")]
        story.helper = first_sonnet_worker(story, 1, tasks[0])
        sonnet_worker(story, tasks[1])
        story.run(KIND_RULE, actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_text("assign-rule list --environment main", "model", actor=story.user)


def test_a_kind_gives_the_task_to_the_worker_with_the_fewest_tasks(new_story):
    story = new_story(fixture=BusyFirstSonnetWorker)
    actors = recorded_actors(story, [new_task(story, "Fourth")])
    story.expect_rows(len(actors) == 1, actors[0] not in (None, story.helper.id), detail=str(actors))


def test_on_a_tie_the_worker_that_waited_longest_gets_the_task(new_story):
    story = new_story(fixture=TwoSonnetWorkers)
    actors = recorded_actors(story, [new_task(story, "Third")])
    story.expect_rows(actors == [story.helper.id], detail=str(actors))


def test_ten_tasks_in_one_step_are_spread_five_and_five(new_story):
    story = new_story(fixture=TwoSonnetWorkers)
    tasks = [new_task(story, f"Batch {number}") for number in range(10)]
    split = Counter(recorded_actors(story, tasks))
    story.expect_rows(sorted(split.values()) == [5, 5], story.helper.id in split, detail=str(split))
