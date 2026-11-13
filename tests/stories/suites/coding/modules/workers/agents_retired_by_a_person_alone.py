from tests.stories.suites.coding.modules.workers.support.commit_command import request_merge
from core.modules.agents.models.agent import Agent
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.helpers.lifetime_reviewers import START_REVIEW, launches, review_job, reviewers
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.merger_rotation import PROGRAM_SAVE, ended_merger, merger_launch
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.merger_launcher import merger_can_start


def test_a_merger_start_on_another_program_reviews_and_a_worker_merge_retire_no_agent(new_story, monkeypatch):
    merger_can_start(monkeypatch)
    story = new_story(fixture=OpenTaskOrchestrator)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    request_merge(story, worker)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    ended_merger(story, monkeypatch)
    story.expect_success(PROGRAM_SAVE.format(program="codex"), actor=story.user)
    merger_launch(story)
    launches(story, START_REVIEW.format(plan=5))
    for plan in range(6, 9):
        story.expect_success(f"agent end {reviewers(story)[0].id}", actor=story.user)
        story.run_listeners()
        launches(story, review_job(story, reviewers(story)[0], plan))
    agents = list(story.story_rows(Agent))
    story.expect_rows(len(reviewers(story)) == 1, all(agent.retired_at is None for agent in agents), detail=str([(agent.number, agent.profile, agent.retired_at) for agent in agents]))
    story.expect_absent("agent list --environment main --json", '"retired_at": "', actor=story.user)
