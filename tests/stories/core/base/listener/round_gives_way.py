from core.base.listener.round_yield import RoundYield
from tests.stories.core.support.fixtures import UserJoined


def test_a_round_gives_way_before_each_event_a_listener_handles_so_a_waiting_hook_gets_the_database(new_story, monkeypatch):
    story = new_story(fixture=UserJoined)
    gave_way = []
    monkeypatch.setattr(RoundYield, "give_way", lambda turns: gave_way.append(True))
    for text in ("one", "two", "three"):
        story.run(f'task make "Fix the cart {text}" --environment main', actor=story.user)
    story.run_listeners()
    assert len(gave_way) >= 3, len(gave_way)
