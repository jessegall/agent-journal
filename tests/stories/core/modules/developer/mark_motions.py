from tests.stories.core.support.fixtures import UserJoined

FRAMES = '{"folds": false, "frames": [{"ms": 0, "phase": "leaving"}]}'


def test_a_recording_of_a_marks_motion_is_kept_and_read_back(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_text("developer mark-motions", "nothing recorded yet")
    story.run(f"developer record-mark-motion '{FRAMES}'", actor=story.user)
    story.expect_text("developer mark-motions", '"phase": "leaving"')
