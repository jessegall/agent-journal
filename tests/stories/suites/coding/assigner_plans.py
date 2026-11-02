from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderWithOpenTask, BuilderWithStartedTask


# task 3 then task 2 sit in plan 1's first phase; task 4 is outside any plan and most urgent
def planned_tasks(story, *, started: bool) -> None:
    story.run('plan make "The rebuild" --brief "all of it" --environment main', actor=story.agent)
    story.run('phase make --plan 1 "First" --goal "it works"', actor=story.agent)
    story.run('task make "Second in the plan" --environment main', actor=story.agent)
    story.run('task make "Third in the plan" --environment main', actor=story.agent)
    story.run("phase place 3 --phase 1", actor=story.agent)
    story.run("phase place 2 --phase 1", actor=story.agent)
    story.run('task make "Outside the plan" --environment main --priority high', actor=story.agent)
    if started:
        for move in ("plan ready 1", "plan approve 1", "plan start 1"):
            story.run(move)


def state_of(story, task_id: int) -> str:
    return story.run(f"task show {task_id}", actor=story.agent).output_text


def test_a_task_leaving_the_hands_is_followed_by_the_started_plans_lowest_id_at_one_priority(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    planned_tasks(story, started=True)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    assert "state: started" in state_of(story, 2), state_of(story, 2)
    assert "state: open" in state_of(story, 3) and "state: open" in state_of(story, 4)


def test_inside_a_phase_the_higher_priority_goes_first(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    planned_tasks(story, started=True)
    story.run("task edit 3 --priority high", actor=story.agent)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    assert "state: started" in state_of(story, 3), state_of(story, 3)


def test_a_critical_task_outside_the_plan_goes_before_the_started_plan(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    planned_tasks(story, started=True)
    story.run("task edit 4 --priority critical", actor=story.agent)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    assert "state: started" in state_of(story, 4), state_of(story, 4)


def test_a_later_phase_waits_until_the_earlier_phase_is_finished(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    story.run('plan make "The rebuild" --brief "all of it" --environment main', actor=story.agent)
    story.run('phase make --plan 1 "First" --goal "it works"', actor=story.agent)
    story.run('phase make --plan 1 "Second" --goal "it ships"', actor=story.agent)
    story.run('task make "Held up" --environment main', actor=story.agent)
    story.run('task make "Urgent but later" --environment main --priority high', actor=story.agent)
    story.run("phase place 2 --phase 1", actor=story.agent)
    story.run("phase place 3 --phase 2", actor=story.agent)
    story.run('task block 2 --reason "waits for the price list"', actor=story.user)
    for move in ("plan ready 1", "plan approve 1", "plan start 1"):
        story.run(move)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    assert "state: open" in state_of(story, 3), state_of(story, 3)


def test_a_stop_with_empty_hands_is_handed_the_started_plans_next_task(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    story.run('task cancel 1 --reason "not needed"', actor=story.agent)
    planned_tasks(story, started=True)
    story.run('task release 3 --reason "later"', actor=story.agent)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "task")
    assert sum("state: started" in state_of(story, task_id) for task_id in (2, 3)) == 1
    assert "state: open" in state_of(story, 4)


def test_the_tasks_of_a_plan_not_yet_started_are_never_handed_out(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    planned_tasks(story, started=False)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    assert "state: started" in state_of(story, 4), state_of(story, 4)
    assert "state: open" in state_of(story, 2) and "state: open" in state_of(story, 3)


def test_when_the_plan_has_nothing_free_the_next_task_outside_it_is_handed_out(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    planned_tasks(story, started=True)
    story.run("task depend 3 --on 4", actor=story.agent)
    story.run("task depend 2 --on 4", actor=story.agent)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    assert "state: started" in state_of(story, 4), state_of(story, 4)
