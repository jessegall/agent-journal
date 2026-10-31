from tests.stories.core.upgrade.support.fixture_upgrade import upgraded_story


def test_a_plan_keeps_its_number_title_and_state(new_story):
    story = upgraded_story(new_story)
    story.expect_success("plan show 1", "title: Checkout", "state: approved")


def test_a_paused_plan_moves_as_approved_so_it_can_be_started_again(new_story):
    story = upgraded_story(new_story)
    story.expect_success("plan show 2", "title: Payments", "state: approved")
