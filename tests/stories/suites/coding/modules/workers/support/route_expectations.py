from core.testing.story import Story
from tests.stories.suites.coding.modules.workers.support.program_split import dispatch, expect_program


def expect_model_route_refusal(story: Story, tag: str) -> None:
    story.expect_success(f'worker-route make --program codex --tags {tag} --environment main', actor=story.agent)
    story.expect_success(f'task tag 1 {tag} --confirm', actor=story.agent)
    story.expect_refusal('worker dispatch --test-command python=pytest 1 --model sonnet', '--tier', actor=story.agent)
    story.expect_text('worker-worktree list', 'nothing found')


def expect_unmatched_route(story: Story, flags: str) -> None:
    story.expect_success(f'worker-route make --program codex {flags} --environment main', actor=story.agent)
    expect_program(story, dispatch(story), 'claude')
