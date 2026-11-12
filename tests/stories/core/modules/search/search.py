from engine.database.database import Database
from tests.stories.core.modules.processes.support.process_samples import start_process
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_endswith_authorization, expect_startswith_listed, expect_value_with, expect_value_without, expect_visited_limit

LONG_BRIEF = "Before " + "words " * 20 + "the cents   rounding\n\nbreaks " + "after " * 30


def test_a_word_matches_by_its_stem_so_hours_finds_two_hourly(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "The two-hourly reviewer" --environment main', actor=story.user)
    story.expect_text('search find reviewer two hours', "task 1: The two-hourly reviewer", actor=story.agent)


def test_a_search_no_row_fully_matches_shows_the_rows_with_most_words_and_says_which_words_each_holds(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Install plan 1124 for the cart" --environment main', actor=story.user)
    story.run('task make "Fix the till" --environment main', actor=story.user)
    story.run('message send "Plan 1124 installed by accident" --environment main', actor=story.user)
    output = story.run('search find installed plan 1124 by mistake', actor=story.agent).output_text
    story.expect_rows("these hold most of them, the closest first" in output, "task 1: Install plan 1124 for the cart [holds: installed, plan, 1124]" in output, "task 2:" not in output, detail=output)
    story.expect_ordered_lines('search find installed plan 1124 by mistake', "message 1: Plan 1124 installed by accident [holds: installed, plan, 1124, by]", "task 1: ", actor=story.agent)


def test_an_older_row_holding_more_of_the_words_is_shown_though_forty_newer_rows_hold_fewer(new_story):
    story = new_story(fixture=UserBuilder)
    story.run('task make "Alpha beta gamma only" --environment main', actor=story.user)
    for number in range(45):
        story.run(f'task make "Alpha beta number {number}" --environment main', actor=story.user)
    output = story.run('search find alpha beta gamma delta', actor=story.agent).output_text
    story.expect_rows("task 1: Alpha beta gamma only [holds: alpha, beta, gamma]" in output, detail=output)


def test_a_process_whose_only_match_is_a_search_command_is_left_out(new_story):
    story = new_story(fixture=UserJoined)
    start_process(story, "journal search find cart", limit_seconds=0)
    start_process(story, "make cart", limit_seconds=0)
    story.expect_text('search find cart', "process 2: make cart", actor=story.agent)
    expect_value_without(story.run('search find cart', actor=story.agent).output_text, "process 1:")


def test_a_message_ranks_above_a_process_that_holds_the_same_words(new_story):
    story = new_story(fixture=UserJoined)
    start_process(story, "make cart", limit_seconds=0)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    story.expect_ordered_lines('search find cart', "message ", "process ", actor=story.agent)
    story.expect_text('search find cart --model process', "process 1: make cart", actor=story.agent)


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


def test_documents_and_reports_match_words_from_title_and_body_in_any_order(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('doc make "Cart research" --abstract "Notes" --body "Slow tests need attention"', actor=story.agent)
    story.expect_success('report make "Cart timings" --abstract "Results" --body "Slow tests need attention"', actor=story.agent)
    story.expect_text('search find tests slow cart', "doc 1: Cart research", "report 1: Cart timings", actor=story.agent)


def test_a_comma_separated_model_filter_searches_only_those_modules(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('doc make "Cart notes" --abstract "Notes" --body "Slow tests"', actor=story.agent)
    story.expect_success('report make "Cart report" --abstract "Results" --body "Slow tests"', actor=story.agent)
    story.expect_success('task make "Cart task" --brief "Slow tests" --environment main', actor=story.agent)
    output = story.run('search find tests cart --model doc,report', actor=story.agent).output_text
    story.expect_rows("doc 1: Cart notes" in output, "report 1: Cart report" in output, "task 1:" not in output)
    story.expect_text('search find tests cart --model task', "task 1: Cart task", actor=story.agent)


def expect_fewer_rows_loaded(loaded, limit) -> None:
    assert loaded < limit, loaded


def test_a_search_that_matches_nothing_loads_no_whole_rows(new_story):
    story = new_story(fixture=UserJoined)
    for number in range(30):
        story.run(f'task make "Fix the cart {number}" --environment main', actor=story.user)
    story.expect_text("task show 1", "Fix the cart", actor=story.agent)
    counts = story.container.get(Database).repeated_work
    previous_count = counts.rows
    story.expect_text("search find zebra quartz plume", "nothing here holds all of", actor=story.agent)
    expect_fewer_rows_loaded(counts.rows - previous_count, 100)
