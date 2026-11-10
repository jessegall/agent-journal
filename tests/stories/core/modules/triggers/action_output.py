from engine.query.queries import Queries
from core.modules.processes.models.process import Process
from core.modules.triggers.models.trigger_action_run import TriggerActionRun
from tests.stories.core.modules.processes.support.process_samples import end_run, ended_run, install_runner
from tests.stories.core.modules.triggers.trigger_details import AgentsEnableTriggers
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.expectations.expect_row import expect_row


def test_saved_words_can_start_with_dashes(new_story):
    story = new_story(fixture=AgentsEnableTriggers)
    story.expect_success('trigger make cart "Mind the cart"', actor=story.agent)
    story.expect_success('trigger edit 1 --phrases=--force --phrases=--hard --phrases=cart', actor=story.agent)
    story.expect_text('trigger list --json', '"phrases": ["--force", "--hard", "cart"]', actor=story.agent)


def test_command_output_goes_to_the_agent_that_fired_it_once(new_story, tmp_path):
    story = install_runner(new_story(fixture=AgentsEnableTriggers))
    story.expect_success(f'''trigger make cart "Mind the cart" --extra-actions '[{{"type":"run","target":"pwd","folder":"{tmp_path}","notify_agent":true}}]' ''', actor=story.agent)
    story.hook("s-1", HookSamples.prompt("Fix the cart"))
    story.run_listeners()
    process = next(story.container.get(Queries).query(Process).all_rows())
    expect_row(process, folder=str(tmp_path))
    expect_row(process, session_agent_id=story.agent.id)
    end_run(story, process, "chosen folder output\ncommand warning\n", exit_code=3)
    story.run_listeners()
    story.expect_hook_allowed("s-1", HookSamples.prompt("Continue"), "agent-line:1")
    story.expect_text("agent-line show 1", "chosen folder output", "command warning", "exit 3", actor=story.agent)
    story.run_listeners()
    story.expect_absent_hook_line("s-1", HookSamples.prompt("Continue again"), "agent-line:1")


def test_output_stays_out_of_the_agent_when_the_switch_is_off(new_story):
    story = install_runner(new_story(fixture=AgentsEnableTriggers))
    story.expect_success('''trigger make cart "Mind the cart" --extra-actions '[{"type":"run","target":"pwd"}]' ''', actor=story.agent)
    story.hook("s-1", HookSamples.prompt("Fix the cart"))
    story.run_listeners()
    process = next(story.container.get(Queries).query(Process).all_rows())
    end_run(story, process, "private command output\n")
    story.run_listeners()
    story.expect_absent_hook_line("s-1", HookSamples.prompt("Continue"), "private command output")


def test_an_old_trigger_run_is_removed_with_its_process(new_story):
    story = install_runner(new_story(fixture=AgentsEnableTriggers))
    story.expect_success("setting set journal.core.processes.processes-kept 1 --environment main", actor=story.agent)
    story.expect_success('''trigger make cart "Mind the cart" --extra-actions '[{"type":"run","target":"pwd"}]' ''', actor=story.agent)
    story.hook("s-1", HookSamples.prompt("Fix the cart"))
    story.run_listeners()
    queries = story.container.get(Queries)
    process = next(queries.query(Process).all_rows())
    end_run(story, process, "old\n")
    ended_run(story, "make recent", "recent\n")
    story.expect_rows(not queries.query(Process).filter(id=process.id).exists(),
                      not queries.query(TriggerActionRun).filter(process_id=process.id).exists())
    story.run_listeners()
