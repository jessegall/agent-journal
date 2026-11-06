from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.program_hooks import ProgramHooks
from core.testing.hook_samples import HookSamples
from tests.stories.core.base.upgrade.support.fixture_upgrade import repeated_upgrade
from tests.stories.core.modules.chat.support.mark_samples import marks_text
import json


def expect_value(actual, expected) -> None:
    assert actual == expected, actual


def expect_changed_code_outcome(outcome, expected) -> None:
    actual = outcome.code
    assert actual != expected, actual


def expect_value_with(actual, expected) -> None:
    assert expected in actual, actual


def expect_visited_limit(visited, expected) -> None:
    actual = len(visited)
    assert actual <= expected, actual


def expect_count_shown(shown, item, expected) -> None:
    actual = shown.count(item)
    assert actual == expected, actual


def expect_count_output(story, text, item, expected) -> None:
    actual = story.run(text, actor=story.user).output_text.count(item)
    assert actual == expected, actual


def expect_answers(answers, expected) -> None:
    actual = len(answers)
    assert actual == expected, actual


def expect_absent_exists_version_four(version_four) -> None:
    actual = version_four.exists()
    assert not actual, actual


def expect_exists_version_four(version_four) -> None:
    actual = version_four.exists()
    assert actual, actual


def expect_code_outcome(outcome, expected) -> None:
    actual = outcome.code
    assert actual == expected, actual


def expect_outcome_with(outcome, expected) -> None:
    actual = outcome.text
    assert expected in actual, actual


def expect_version_four_map_limit(text, text_2, expected) -> None:
    actual = {text, text_2}
    assert actual <= expected, actual


def expect_changed_value(actual, expected) -> None:
    assert actual is not expected, actual


def expect_value_2(story, text, expected) -> None:
    actual = story.container.get(Database).rows(Statement(text))[0][0]
    assert actual == expected, actual


def expect_bytes_database_home(story, expected) -> None:
    actual = story.home.database.read_bytes()
    assert actual == expected, actual


def expect_bytes_source(source, expected) -> None:
    actual = source.read_bytes()
    assert actual == expected, actual


def expect_value_without(actual, expected) -> None:
    assert expected not in actual, actual


def expect_value_line(actual, expected) -> None:
    assert any(expected in line for line in actual), actual


def expect_lines(lines, number, expected) -> None:
    actual = lines[-number]
    assert actual == expected, actual


def expect_program_hooks(folder, item, expected) -> None:
    actual = ProgramHooks.read(folder / item)
    assert actual == expected, actual


def expect_startswith_listed(listed, text) -> None:
    actual = listed.startswith(text)
    assert actual, actual


def expect_value_3(story, expected) -> None:
    actual = story.container.get(ManagedHooks).all()
    assert actual == expected, actual


def expect_program_hooks_2(hooks, expected) -> None:
    actual = hooks[0].program
    assert actual == expected, actual


def expect_command_hooks(hooks, expected) -> None:
    actual = hooks[0].command
    assert actual == expected, actual


def expect_program_hooks_3(path, expected) -> None:
    actual = ProgramHooks.read(path)
    assert actual == expected, actual


def expect_updated_input_hook(story, text, item, expected) -> None:
    actual = dict(story.hook(text, item).updated_input)
    assert actual == expected, actual


def expect_count_marks(story, text, expected) -> None:
    actual = marks_text(story).count(text)
    assert actual == expected, actual


def expect_system_log_with(story, expected) -> None:
    actual = story.system_log_text()
    assert expected in actual, actual


def expect_events_window_with(window, expected) -> None:
    actual = window.events
    assert expected in actual, actual


def expect_output(story, text, expected) -> None:
    actual = story.run(text).output_text
    assert actual == expected, actual


def expect_absent_value(actual) -> None:
    assert not actual, actual


def expect_total_closed(closed, expected) -> None:
    actual = closed['total']
    assert actual == expected, actual


def expect_refusal_hook(story, text) -> None:
    actual = story.hook(text, HookSamples.stop()).refusal
    assert actual, actual


def expect_total_cost_less(cost, expected) -> None:
    actual = cost.total
    assert actual < expected, actual


def expect_greater(actual, expected) -> None:
    assert actual > expected, actual


def expect_refusal_reply(reply, expected) -> None:
    actual = reply.refusal
    assert actual == expected, actual


def expect_updated_input_reply(reply, expected) -> None:
    actual = dict(reply.updated_input)
    assert actual == expected, actual


def expect_absent_exists_managed_hooks(story) -> None:
    actual = story.home.managed_hooks_file.exists()
    assert not actual, actual


def expect_output_2(story, text, expected) -> None:
    actual = story.run(text, actor=story.agent).output_text
    assert actual == expected, actual


def expect_refusal_hook_rule(rule_story, text, sample) -> None:
    actual = rule_story.hook(text, sample).refusal
    assert actual, actual


def expect_value_4(actual) -> None:
    assert actual, actual


def expect_last_answer(answer) -> None:
    actual = answer['is_last_page']
    assert actual, actual


def expect_absent_last(first) -> None:
    actual = first['is_last_page']
    assert not actual, actual


def expect_lines_2(lines, expected) -> None:
    actual = lines[1]
    assert actual == expected, actual


def expect_lines_3(lines, text, expected) -> None:
    actual = [line for line in lines if text in line]
    assert actual == expected, actual


def expect_lines_reply_line(reply, expected) -> None:
    actual = reply.lines
    assert any(expected in line for line in actual), actual


def expect_endswith_authorization(authorization, text) -> None:
    actual = authorization.endswith(text)
    assert actual, actual


def expect_lines_with(lines, expected) -> None:
    actual = lines[0]
    assert expected in actual, actual


def expect_index(text, text_2, text_3, text_4) -> None:
    actual = text.index(text_2) < text.index(text_3) < text.index(text_4)
    assert actual, actual


def expect_value_without_line(actual, expected) -> None:
    assert not any(expected in line for line in actual), actual


def expect_poll_second(second, expected) -> None:
    actual = second.poll()
    assert actual is expected, actual


def expect_handler(handler, story, expected) -> None:
    actual = handler(story.container)
    assert actual is expected, actual


def expect_count_output_2(story, text, text_2, expected) -> None:
    actual = story.run(text).output_text.count(text_2)
    assert actual == expected, actual


def expect_value_5(value, expected) -> None:
    actual = json.loads(value)
    assert actual == expected, actual


def expect_changed_with(changed, expected) -> None:
    actual = changed.read_text()
    assert expected in actual, actual


def expect_absent_exists_parent_stale(stale) -> None:
    actual = stale.parent.exists()
    assert not actual, actual


def expect_file_2(own_file, expected) -> None:
    actual = own_file.read_text()
    assert actual == expected, actual


def expect_id_cancelled(cancelled, expected) -> None:
    actual = [row['id'] for row in cancelled['rows']]
    assert actual == expected, actual


def expect_command_file(command_folder, text, expected) -> None:
    actual = (command_folder / text).read_text().strip()
    assert actual == expected, actual


def expect_repeated_upgrade(story, expected) -> None:
    actual = repeated_upgrade(story).text
    assert actual == expected, actual


def expect_wait_arrived(arrived, item) -> None:
    actual = arrived.wait(item)
    assert actual, actual


def expect_absent_exists_with_log(log, text) -> None:
    actual = log.with_name(text).exists()
    assert not actual, actual


def expect_absent_exists_folder_repository(repository, worker_file) -> None:
    actual = (repository.folder / worker_file).exists()
    assert not actual, actual


def expect_requests_launcher(launcher, expected) -> None:
    actual = len(launcher.requests)
    assert actual == expected, actual
