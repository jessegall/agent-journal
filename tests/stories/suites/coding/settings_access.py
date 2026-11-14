from tests.stories.suites.coding.support.main_controls_fixture import MainControlsActors, agent_actors
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_LIMIT
from suites.coding.support.coding_settings import AUTO_MODE_SETTING

AUTO = f"{AUTO_MODE_SETTING}"
WORKER_LIMIT = f"{WORKER_RUN_LIMIT}"


# the main agent is asked to get a user's word; a helper type that may not run setting make at all is refused by its type
def setting_make_refusal(role: str) -> str:
    return "A user was asked" if role == "main" else "may not run setting make"


def test_s45_direct_row_writes_are_refused_to_every_agent_role_and_the_person_value_is_read_by_every_role_that_reads_settings(new_story):
    story = new_story(fixture=MainControlsActors)
    actors = agent_actors(story)
    for role, actor in actors.items():
        story.expect_refusal(f"setting make {AUTO} false --environment main --reason 'a story asks'", setting_make_refusal(role), actor=actor)
        story.expect_refusal(f"setting make {WORKER_LIMIT} 9 --environment main --reason 'a story asks'", setting_make_refusal(role), actor=actor)
    story.expect_success(f"setting set {WORKER_LIMIT} 4 --environment main", actor=story.user)
    for role, actor in actors.items():
        if role == "worker":
            story.expect_refusal(f"setting show {WORKER_LIMIT} --environment main", "A worker may not run setting show", actor=actor)
        else:
            story.expect_success(f"setting show {WORKER_LIMIT} --environment main", "value: 4", actor=actor)
    story.expect_success(f"setting show {AUTO} --environment main", "value: True", actor=story.user)
