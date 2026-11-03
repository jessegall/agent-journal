from tests.stories.core.support.fixtures import UserJoined

DEMO_LINK = "http://127.0.0.1:52816/?environment=demo"


def test_a_pin_is_pinned_with_its_link_and_label_and_listed(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f'pin make "Version 5 demo" --link "{DEMO_LINK}" --label "Open the demo" --environment main',
                         f"pin 1 made: Version 5 demo -> {DEMO_LINK}", actor=story.agent)
    story.expect_text("pin list --environment main", "Version 5 demo", DEMO_LINK, actor=story.user)


def test_a_pin_may_point_at_a_row_of_the_journal(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the cart" --environment main', actor=story.user)
    story.expect_success('pin make "The cart task" --link task:1 --environment main', "pin 1 made: The cart task -> task:1", actor=story.agent)


def test_a_link_that_is_neither_an_address_nor_a_row_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal('pin make "Odd" --link "somewhere" --environment main', "a pin links to an address that starts with http, or to a row such as task:12",
                         actor=story.agent)


def test_a_closed_pin_leaves_the_list(new_story):
    story = new_story(fixture=UserJoined)
    story.run(f'pin make "Version 5 demo" --link "{DEMO_LINK}" --environment main', actor=story.agent)
    story.expect_text("pin close 1", "pin 1 closed", actor=story.user)
    story.expect_absent("pin list --environment main", "Version 5 demo", actor=story.user)
    story.expect_refusal("pin close 1", "pin 1 is closed already", actor=story.user)


def test_a_title_over_80_characters_is_refused_with_where_the_rest_goes(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal(f'pin make "{"a" * 81}" --link "{DEMO_LINK}" --environment main', "a title is at most 80 characters", actor=story.agent)
