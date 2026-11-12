from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.drivers.support.confirmed_skips import confirmed_skip
from tests.stories.core.support.plan_steps import state_tasks_wait_on_nothing
from tests.stories.suites.coding.modules.workers.support.program_split import dispatch, expect_program, new_task, split_story

GUARD = "workers.model-fits-complexity"
SKIP_REASON = "The user asked for the strongest model on it"


def easy_task(story):
    return new_task(story, "Rename a label", "--complexity 2")


def test_an_easy_task_sent_alone_to_the_strongest_model_is_refused_until_skipped(split_story):
    task_id = easy_task(split_story)
    split_story.expect_refusal(f"worker dispatch --test-command python=pytest {task_id} --model opus",
                               f"task {task_id} complexity 2 is below 3: a general model fits it", actor=split_story.agent)
    confirmed_skip(split_story, GUARD, split_story.agent, SKIP_REASON)
    worker = dispatch(split_story, str(task_id), f'--model opus --skip-guard {GUARD} --skip-reason "{SKIP_REASON}"')
    expect_program(split_story, worker, "claude", "opus")


def test_an_easy_task_goes_to_a_general_model(split_story):
    worker = dispatch(split_story, str(easy_task(split_story)), "--model sonnet")
    expect_program(split_story, worker, "claude", "sonnet")


def test_a_plan_with_easy_tasks_goes_to_the_strongest_model(split_story):
    story = split_story
    plan_id = story.new_row_id('plan make "A plan" --brief "A goal"', actor=story.agent)
    phase_id = story.new_row_id(f'phase make --plan {plan_id} "One" --goal "It is done"', actor=story.agent)
    story.expect_success(f'task make "First" --phase {phase_id} --complexity 1', actor=story.agent)
    story.expect_success(f'task make "Second" --phase {phase_id} --complexity 2', actor=story.agent)
    state_tasks_wait_on_nothing(story, story.agent, plan_id)
    story.expect_success(f"plan ready {plan_id}", actor=story.agent)
    story.expect_success(f"plan approve {plan_id} --environment main", actor=Actor(story.user.id, ActorType.USER))
    worker = dispatch(story, "", f"--plan {plan_id} --model opus")
    expect_program(story, worker, "claude", "opus")
