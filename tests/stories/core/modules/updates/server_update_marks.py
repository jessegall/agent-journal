from core.base.query.queries import Queries
from core.modules.chat.models.chat_mark import ChatMark
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value

RUN = "r1"


def run_step(story, line: str) -> None:
    answer = story.run(line, actor=story.user, environment_id=1)
    expect_value(answer.code, 0)


def update_mark(story) -> ChatMark:
    return next(story.container.get(Queries).query(ChatMark).filter(key=f"server-update:{RUN}").all_rows())


def test_one_mark_moves_through_the_steps_of_a_server_update_and_ends_with_the_version(new_story):
    story = new_story(fixture=UserJoined)
    step_marks = []
    for step in ("proof", "handover", "serving"):
        run_step(story, f"update step {RUN} {step}")
        mark = update_mark(story)
        step_marks.append((mark.variant, mark.figure, mark.fraction, mark.state.value))
    run_step(story, f"update step {RUN} finished abc123")
    last = update_mark(story)
    expect_value(step_marks, [("proof", "step 1 of 4", 0.25, "shown"), ("handover", "step 2 of 4", 0.5, "shown"), ("serving", "step 3 of 4", 0.75, "shown")])
    expect_value((last.variant, last.text, last.outcome.value, last.state.value), ("finished", "Server updated to abc123", "passed", "ended"))
    expect_value(len(list(story.container.get(Queries).query(ChatMark).filter(type="updates.server-update").all_rows())), 1)


def test_a_refused_server_update_ends_its_mark_with_the_reason(new_story):
    story = new_story(fixture=UserJoined)
    run_step(story, f"update step {RUN} proof")
    run_step(story, f'update step {RUN} failed "code version abc was not taken over"')
    mark = update_mark(story)
    expect_value((mark.variant, mark.outcome.value, mark.state.value, mark.detail), ("failed", "failed", "ended", "code version abc was not taken over"))
