from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_endswith_authorization, expect_startswith_listed, expect_value_with, expect_value_without, expect_visited_limit

LONG_BRIEF = "Before " + "words " * 20 + "the cents   rounding\n\nbreaks " + "after " * 30


def test_a_row_holding_every_word_in_any_of_its_fields_is_found_with_its_noun_and_number(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the cart" --brief "totals in cents" --environment main', actor=story.user)
    story.expect_text('search find cart cents', "task 1: ", actor=story.agent)


def test_a_row_missing_one_word_is_not_found_and_no_hit_says_which_words(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the cart" --brief "totals in cents" --environment main', actor=story.user)
    story.expect_success('search find cart euros', "nothing here holds all of: cart euros", actor=story.agent)


def test_words_match_whatever_their_case(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the Cart" --environment main', actor=story.user)
    story.expect_text('search find CART', "task 1: Fix the Cart", actor=story.agent)


def test_hits_of_every_model_come_newest_first(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "The cart task" --environment main', actor=story.user)
    story.run('doc make "Cart rules" --abstract "How the cart counts" --body "## Totals\nin cents"', actor=story.user)
    story.expect_ordered_lines('search find cart', "doc 1: ", "task 1: ", actor=story.agent)


def test_a_hit_shows_a_short_passage_around_the_first_word_with_its_spaces_folded_and_its_cut_ends_marked(new_story):
    story = new_story(fixture=UserJoined)
    story.run(f'task make "Long one" --brief "{LONG_BRIEF}" --environment main', actor=story.user)
    hit = story.run('search find rounding', actor=story.agent).output_text.strip()
    excerpt = hit.removeprefix("task 1: ")
    expect_startswith_listed(excerpt, "…")
    expect_endswith_authorization(excerpt, "…")
    expect_value_with(excerpt, "the cents rounding breaks")
    expect_value_without(excerpt, "  ")
    expect_value_without(excerpt, "\n")
    expect_visited_limit(excerpt, 162)


def test_the_model_option_keeps_the_hits_to_the_models_named(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "The cart task" --environment main', actor=story.user)
    story.run('doc make "Cart rules" --abstract "How the cart counts" --body "in cents"', actor=story.user)
    story.expect_absent('search find cart --model task', "doc 1: Cart rules", actor=story.agent)
    story.expect_text('search find cart --model task', "task 1: ", actor=story.agent)


def test_a_model_that_is_not_searched_is_refused_with_the_models_that_are(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal('search find cart --model ghost', "ghost is no model search reads", actor=story.agent)


def test_at_most_forty_hits_are_shown_and_the_line_says_more_were_found(new_story):
    story = new_story(fixture=UserJoined)
    for number in range(45):
        story.run(f'task make "Cart task {number}" --environment main', actor=story.user)
    output = story.run('search find cart', actor=story.agent).output_text
    expect_sum_startswith_output("task ", output, 40)
    expect_value_with(output, "45 rows hold all of: cart, the newest 40 are shown")


def expect_sum_startswith_output(text, output, expected) -> None:
    actual = sum((line.startswith(text) for line in output.splitlines()))
    assert actual == expected, actual
