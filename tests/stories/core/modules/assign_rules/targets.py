import json

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.stories.story import Story
from tests.stories.core.modules.assign_rules.support.rule_steps import ENVIRONMENT, FREE_TASK_ID, SonnetWorkerAndFreeTask
from tests.stories.core.support.agent_labels import agent_number

KIND_FLAGS = "--target model --program claude --model sonnet"


def rule_for(story: Story, target_flags: str, extra: str = "") -> int:
    return story.new_row_id(f'assign-rule make {target_flags} --condition "title has_word migration" {extra} {ENVIRONMENT}', actor=story.user)


def worker_flags(story: Story, worker: Actor) -> str:
    return f"--target agent --agent {agent_number(story, worker.id)}"


def decision(story: Story) -> dict:
    return json.loads(story.run(f"assign-decision record {FREE_TASK_ID} --json {ENVIRONMENT}", actor=story.user).output_text.splitlines()[0])


def expect_decision(story: Story, outcome: str, actor_id: int | None, *reason_parts: str) -> None:
    made = decision(story)
    story.expect_rows(made["outcome"] == outcome, made["actor_id"] == actor_id, all(part in made["reason"] for part in reason_parts), detail=str(made))


def test_a_kind_rule_finds_a_worker_whose_model_has_the_word(new_story):
    story = new_story(fixture=SonnetWorkerAndFreeTask)
    rule_id = rule_for(story, KIND_FLAGS)
    expect_decision(story, "dry_run", story.helper.id, f"rule {rule_id} matches", "claude sonnet")


def test_a_kind_with_no_worker_skips_the_rule(new_story):
    story = new_story(fixture=SonnetWorkerAndFreeTask)
    rule_id = rule_for(story, "--target model --program claude --model opus")
    expect_decision(story, "skipped", None, f"rule {rule_id} skipped", "no agent of claude opus can take it now: no agent runs that program and model")


def test_a_paused_worker_is_passed_over_for_a_kind_and_kept_as_the_one_named(new_story):
    story = new_story(fixture=SonnetWorkerAndFreeTask)
    story.expect_success(f"agent pause {agent_number(story, story.helper.id)}", actor=story.user)
    rule_for(story, KIND_FLAGS)
    expect_decision(story, "skipped", None, "no agent of claude sonnet can take it now")
    named = rule_for(story, worker_flags(story, story.helper))
    expect_decision(story, "dry_run", story.helper.id, f"rule {named} matches", "paused")


def test_an_ended_worker_is_skipped_since_a_task_cannot_be_assigned_to_it(new_story):
    story = new_story(fixture=SonnetWorkerAndFreeTask)
    story.run(f"agent end {story.helper.id}", actor=story.helper)
    rule_id = rule_for(story, worker_flags(story, story.helper))
    expect_decision(story, "skipped", None, f"rule {rule_id} skipped", "has ended")


def test_a_worker_with_no_cut_worktree_is_skipped_naming_the_cause(new_story):
    story = new_story(fixture=SonnetWorkerAndFreeTask)
    bare = Actor(story.new_row_id(f"agent start w-9 claude worker --parent {story.agent.id} {ENVIRONMENT}"), ActorType.AGENT)
    rule_id = rule_for(story, worker_flags(story, bare))
    expect_decision(story, "skipped", None, f"rule {rule_id} skipped", "takes no task")


def test_no_main_agent_running_skips_the_rule_for_the_main_agent(new_story):
    story = new_story(fixture=SonnetWorkerAndFreeTask)
    rule_id = rule_for(story, "--target main")
    story.run(f"agent end {story.agent.id}")
    expect_decision(story, "skipped", None, f"rule {rule_id} skipped: no main agent runs")


def test_a_helper_is_never_a_target(new_story):
    story = new_story(fixture=SonnetWorkerAndFreeTask)
    helper = Actor(story.new_row_id(f"agent start sub-9 claude helper --parent {story.agent.id} {ENVIRONMENT}"), ActorType.AGENT)
    story.expect_refusal(f'assign-rule make {worker_flags(story, helper)} --condition any {ENVIRONMENT}', "helpers take no task", actor=story.user)


def test_a_full_queue_skips_the_rule_and_the_next_rule_wins(new_story):
    story = new_story(fixture=SonnetWorkerAndFreeTask)
    capped = rule_for(story, worker_flags(story, story.helper), "--queue-limit 1")
    fallback = rule_for(story, "--target main")
    label = f"worker {agent_number(story, story.helper.id)}"
    expect_decision(story, "dry_run", story.agent.id, f"rule {capped} skipped: {label} holds 1 of 1", f"rule {fallback} matches")
