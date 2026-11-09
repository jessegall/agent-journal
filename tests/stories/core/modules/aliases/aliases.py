from tests.stories.core.support.fixtures import UserJoined


def test_an_alias_is_added_and_listed_with_its_line(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('alias add greet "echo hello {args}"', "alias greet added: journal greet [args] runs echo hello {args}", actor=story.agent)
    story.expect_text("alias list", "greet", "echo hello {args}", actor=story.agent)


def test_an_alias_runs_its_line_with_the_arguments_in_place_of_the_args_mark(new_story):
    story = new_story(fixture=UserJoined)
    story.run('alias add greet "echo hello {args} again"', actor=story.agent)
    story.expect_success("greet Ada", "hello Ada again", actor=story.agent)


def test_an_alias_with_no_args_mark_gets_the_arguments_after_its_line(new_story):
    story = new_story(fixture=UserJoined)
    story.run('alias add say "echo said"', actor=story.agent)
    story.expect_success("say one two", "said one two", actor=story.agent)


def test_an_argument_is_passed_as_one_word_and_never_run_as_shell(new_story):
    story = new_story(fixture=UserJoined)
    story.run('alias add say "echo said"', actor=story.agent)
    story.expect_success('say "a; echo broken"', "said a; echo broken", actor=story.agent)


def test_an_alias_runs_with_its_variables(new_story):
    story = new_story(fixture=UserJoined)
    story.run("alias add who 'echo name is $NAME' --env NAME=Ada", actor=story.agent)
    story.expect_success("who", "name is Ada", actor=story.agent)


def test_an_alias_gives_back_the_exit_code_of_its_line(new_story):
    story = new_story(fixture=UserJoined)
    story.run('alias add fail "exit 4"', actor=story.agent)
    story.run("fail", actor=story.agent).expect_code(4)


def test_a_journal_command_name_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal('alias add task "echo x"', "task is a journal command: pick another name", actor=story.agent)


def test_a_taken_name_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    story.run('alias add greet "echo hello"', actor=story.agent)
    story.expect_refusal('alias add greet "echo again"', "the alias greet exists: change it with journal alias edit greet", actor=story.agent)


def test_a_reader_that_does_not_exist_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal('alias add tests "pytest" --reader ghost', "no reader is called ghost: journal reader list lists them", actor=story.agent)


def test_a_variable_without_its_value_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal('alias add who "echo x" --env NAME', "a variable is NAME=value, not NAME", actor=story.agent)


def test_an_alias_line_is_changed_and_an_alias_removed(new_story):
    story = new_story(fixture=UserJoined)
    story.run('alias add greet "echo hello"', actor=story.agent)
    story.expect_success('alias edit greet --line "echo bye"', "alias greet changed", actor=story.agent)
    story.expect_success("greet", "bye", actor=story.agent)
    story.expect_success("alias remove greet", "alias greet removed", actor=story.agent)
    story.expect_absent("alias list", "greet", actor=story.agent)
