from contextlib import nullcontext

from engine.listener.round_yield import RoundYield
from tests.stories.core.support.fixtures import UserJoined


def test_a_round_waits_its_turn_before_each_event_a_listener_handles_so_a_waiting_hook_gets_the_database(played, monkeypatch):
    story = played(UserJoined)
    turns = []
    monkeypatch.setattr(RoundYield, "event_turn", lambda runner, event_name: (turns.append(event_name), nullcontext())[1])
    for text in ("one", "two", "three"):
        story.run(f'task make "Fix the cart {text}" --environment main', actor=story.user)
    story.run_listeners()
    story.expect_rows(len(turns) >= 3)
