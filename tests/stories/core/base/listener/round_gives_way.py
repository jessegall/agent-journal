from core.base.listener.round_yield import RoundYield
from tests.stories.core.support.fixtures import UserJoined


def test_a_round_pauses_before_each_event_a_listener_handles_so_a_waiting_hook_gets_the_database(new_story, monkeypatch):
    story = new_story(fixture=UserJoined)
    pauses = []
    monkeypatch.setattr(RoundYield, "pause", lambda runner: pauses.append(runner))
    for text in ("one", "two", "three"):
        story.run(f'task make "Fix the cart {text}" --environment main', actor=story.user)
    story.run_listeners()
    story.expect_rows(len(pauses) >= 3)
