from tests.stories.suites.coding.support.main_controls_fixture import MainControlsActors, agent_actors
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_LIMIT
from suites.coding.support.coding_settings import AUTO_MODE_SETTING

AUTO = f"{AUTO_MODE_SETTING}"
WORKER_LIMIT = f"{WORKER_RUN_LIMIT}"


def test_s45_direct_row_writes_are_refused_to_every_agent_role_and_the_person_value_is_read_by_all(new_story):
    story = new_story(fixture=MainControlsActors)
    actors = agent_actors(story)
    for actor in actors.values():
        story.expect_refusal(f"setting make {AUTO} false --environment main --reason 'a story asks'", "A user was asked", actor=actor)
        story.expect_refusal(f"setting make {WORKER_LIMIT} 9 --environment main --reason 'a story asks'", "A user was asked", actor=actor)
    story.expect_success(f"setting set {WORKER_LIMIT} 4 --environment main", actor=story.user)
    for actor in actors.values():
        story.expect_success(f"setting show {WORKER_LIMIT} --environment main", "value: 4", actor=actor)
    story.expect_success(f"setting show {AUTO} --environment main", "value: True", actor=story.user)
