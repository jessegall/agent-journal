import shlex

from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.modules.aliases.running import worker_actor
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.server.support.alias_hook import AliasHook
from tests.stories.server.support.server_client import server_story


def test_the_alias_reader_and_background_option_survive_expansion(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    reader = story.new_row_id('reader add checker --commands "echo checker" --lines "checker"')
    story.expect_success('alias add judged "echo checker {args}" --reader checker --background --category check')
    story.run_listeners()
    with server_story(story) as server:
        AliasHook(server).expect_options("journal judged --changes", "echo checker --changes", reader)


def test_a_saved_test_command_the_classifier_does_not_know_shows_as_a_test_run(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_success('alias add sampled "python3 sample.py" --category "test run"')
    story.run_listeners()
    with server_story(story) as server:
        AliasHook(server).expect_visible_test_run("journal sampled --tail 5", "python3 sample.py")


def test_alias_variables_apply_to_the_whole_expanded_command(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_success(shlex.join(["alias", "add", "labelled", 'printf "%s" "$CHECK_LABEL"', "--env", "CHECK_LABEL=two words"]))
    story.run_listeners()
    with server_story(story) as server:
        AliasHook(server).expect_execution("journal labelled", '( export \'CHECK_LABEL=two words\'; printf "%s" "$CHECK_LABEL"  )', "two words")


def test_a_cyclic_alias_is_refused_with_a_recovery_instruction(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_success('alias add first-check "journal second-check {args}"')
    story.expect_success('alias add second-check "journal first-check {args}"')
    story.run_listeners()
    with server_story(story) as server:
        AliasHook(server).expect_denied("journal first-check", "alias")


def test_expansion_keeps_the_worker_permission_on_the_alias(new_story):
    story, worker = worker_actor(new_story)
    story.expect_success('alias add judged "echo checker {args}"', actor=story.agent)
    story.run_listeners()
    session = story.container.get(Queries).query(Agent).find(worker.id).session
    with server_story(story) as server:
        hook = AliasHook(server, session)
        hook.expect_denied("journal judged src", "marked for agents")
        story.expect_success("alias edit judged --agents", actor=story.agent)
        story.run_listeners()
        hook.expect_expanded("journal judged src", "echo checker src")
