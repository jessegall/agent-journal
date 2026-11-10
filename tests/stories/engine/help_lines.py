from tests.stories.core.support.fixtures import UserJoined


def test_help_lists_the_subcommands_of_a_name_with_its_own_and_built_ones_but_not_the_excluded(new_story):
    story = new_story(fixture=UserJoined)
    text = story.run("task --help", actor=story.user)
    text.expect_code(0)
    for name in ("block", "close", "board", "make", "list"):
        text.expect_text(f"  {name}\n")


def test_a_name_alone_lists_its_subcommands_too(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_text("sequence", "  run\n", actor=story.user)


def test_a_name_that_is_only_subcommands_lists_them(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_text("wait -h", "  on\n", actor=story.user)


def test_help_alone_lists_the_names(new_story):
    story = new_story(fixture=UserJoined)
    text = story.run("--help", actor=story.user)
    text.expect_code(0)
    for name in ("task", "plan", "message"):
        text.expect_text(f"  {name}\n")


def test_help_on_a_name_the_journal_does_not_have_says_so(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_usage_error("shop --help", actor=story.user)
    story.run("shop --help", actor=story.user).expect_text("journal has no shop commands")


def test_a_subcommand_it_does_not_have_names_the_ones_it_has(new_story):
    story = new_story(fixture=UserJoined)
    text = story.run("task new --help", actor=story.user)
    text.expect_text("journal task has no subcommand new; it has:")
    text.expect_text("block")


def test_a_subcommands_own_help_still_shows_its_flags(new_story):
    story = new_story(fixture=UserJoined)
    text = story.run("task block --help", actor=story.user)
    text.expect_code(0)
    text.expect_text("--until")
