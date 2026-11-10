from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.stories.story import Story
from tests.stories.core.modules.plans.support.started_plans import DEFAULT_FOCUS, PLAN_FOCUS, ThreeStartedPlans
from tests.stories.core.support.plan_steps import ready_plan

FOCUS_ON_FIRST_PLAN = f"plan 1 is your focus: {DEFAULT_FOCUS}"
LONGEST_CHAIN = 10


def outside_task(story: Story, title: str) -> int:
    return story.new_row_id(f'task make "{title}" --environment main', actor=story.user)


def second_agent(story: Story) -> Actor:
    return Actor(story.new_row_id(f"agent start s-2 claude worker --parent {story.agent.id} --environment main"), ActorType.AGENT)


def test_c1_a_task_of_a_plan_nobody_approved_is_not_handed_out_and_the_read_names_that_plan(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.run('plan make "Yard" --environment main', actor=story.user)
    story.run('phase make --plan 4 "Build"', actor=story.user)
    task_id = outside_task(story, "Fence")
    story.run(f"phase place {task_id} --phase 4", actor=story.user)
    story.run(f"task depend 2 --on {task_id}", actor=story.user)
    story.expect_success(PLAN_FOCUS, FOCUS_ON_FIRST_PLAN, f"it waits on task {task_id}, which is in plan 4, a plan nobody approved", actor=story.agent)


def test_c2_a_task_behind_the_checkpoint_of_another_plan_is_not_handed_out_and_the_read_names_the_checkpoint(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.run('plan make "Yard" --environment main', actor=story.user)
    story.run('phase make --plan 4 "Survey" --checkpoint', actor=story.user)
    story.run('phase make --plan 4 "Build"', actor=story.user)
    survey_id, fence_id = outside_task(story, "Measure"), outside_task(story, "Fence")
    story.run(f"phase place {survey_id} --phase 4", actor=story.user)
    story.run(f"phase place {fence_id} --phase 5", actor=story.user)
    ready_plan(story, 4, actor=story.user)
    for move in ("approve", "start"):
        story.run(f"plan {move} 4 --environment main", actor=story.user)
    story.run(f"task depend 2 --on {fence_id}", actor=story.user)
    story.expect_success(PLAN_FOCUS, FOCUS_ON_FIRST_PLAN, f"it waits on task {fence_id}, which is behind the checkpoint phase 4 of plan 4", actor=story.agent)


def test_c3_a_task_reserved_for_another_agent_is_not_handed_out_and_the_read_names_that_agent(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    second_agent(story)
    task_id = outside_task(story, "Supplier contract")
    story.run(f"task assign {task_id} --to 2", actor=story.agent)
    story.run(f"task depend 2 --on {task_id}", actor=story.user)
    story.expect_success(PLAN_FOCUS, FOCUS_ON_FIRST_PLAN, f"it waits on task {task_id}, which is reserved for agent 2", actor=story.agent)


def test_c4_a_task_another_agent_started_is_not_handed_out_and_the_read_names_its_holder(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    holder = second_agent(story)
    task_id = outside_task(story, "Supplier contract")
    story.run(f"task assign {task_id} --to 2", actor=story.agent)
    story.run(f"task start {task_id}", actor=holder)
    story.run(f"task depend 2 --on {task_id}", actor=story.user)
    story.expect_success(PLAN_FOCUS, FOCUS_ON_FIRST_PLAN, f"it waits on task {task_id}, which agent 2 holds", actor=story.agent)


def test_c5_a_task_that_waits_on_a_command_is_not_handed_out_and_the_read_says_what_it_waits_on(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    task_id = outside_task(story, "Supplier contract")
    story.run(f"task block {task_id} --until 'test -f contract.pdf' --every 5", actor=story.user)
    story.run(f"task depend 2 --on {task_id}", actor=story.user)
    story.expect_success(PLAN_FOCUS, FOCUS_ON_FIRST_PLAN, f"it waits on task {task_id}, which waits on a command", actor=story.agent)


def test_c9_a_chain_of_waits_longer_than_the_limit_is_reported_and_the_plan_keeps_its_own_ready_task(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    chain = [outside_task(story, f"Step {number}") for number in range(1, LONGEST_CHAIN + 3)]
    story.run(f"task depend 2 --on {chain[0]}", actor=story.user)
    for waiting_id, dependency_id in zip(chain, chain[1:]):
        story.run(f"task depend {waiting_id} --on {dependency_id}", actor=story.user)
    story.expect_success(PLAN_FOCUS, FOCUS_ON_FIRST_PLAN, f"it waits on task {chain[0]}, whose chain of waits is longer than {LONGEST_CHAIN} tasks", actor=story.agent)
    story.run("task start 1", actor=story.agent)
    story.expect_success("task show 1", "state: started")
