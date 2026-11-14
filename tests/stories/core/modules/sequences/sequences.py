import pytest

from engine.testing.stories.story_fixture import StoryFixture

import json
import shlex

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.database.database import Database
from engine.query.queries import Queries
from core.modules.sequences.models.sequence_run import SequenceRun
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value
from core.modules.sequences.support.sequence_nudges import STEP_EDIT_BAN
from engine.testing.expectations.expected_nudge import expected_nudge
from core.modules.sequences.support.sequence_nudges import STEP_WAITS


class ReleaseSequence(StoryFixture):
    parent = UserJoined

    def steps(self, story):
        story.expect_success('sequence make "Release" --steps "Run the suite | Tag the release"', 'sequence 1: Release, 2 steps', actor=story.user)


def sequence_story(new_story):
    return new_story(fixture=ReleaseSequence)


def test_a_sequence_is_made_with_its_steps_and_shown_in_order(new_story):
    story = sequence_story(new_story)
    story.expect_ordered_lines("sequence show 1", "sequence 1: Release, starts by hand only", "1. Run the suite", "2. Tag the release", actor=story.user)


def test_a_sequence_with_no_step_is_refused_with_how_to_give_steps(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal('sequence make "Empty"', "a sequence has at least one step", actor=story.user)


def test_running_a_sequence_tells_the_agent_its_first_step_and_next_moves_it_on_to_the_end(new_story):
    story = sequence_story(new_story)
    story.expect_text("sequence run 1", "sequence 1, step 1: Run the suite", actor=story.agent)
    story.run("sequence follow", actor=story.agent)
    story.expect_text("sequence next", "sequence 1, step 2: Tag the release", actor=story.agent)
    story.run("sequence follow", actor=story.agent)
    story.expect_text("sequence next", "sequence 1 ran its last step", actor=story.agent)


def test_next_before_the_step_is_taken_up_is_refused_with_the_follow_command(running_release):
    story = running_release
    story.expect_refusal("sequence next", "step 1 of sequence 1 was never taken up", actor=story.agent)


def test_a_step_not_taken_up_holds_the_agents_edits(running_release):
    story = running_release
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), STEP_WAITS.nudge(sequence=1, step=1).text)


def test_abandoning_names_the_steps_left_undone_and_goes_through_with_sure(running_release):
    story = running_release
    story.run("sequence follow", actor=story.agent)
    story.expect_refusal('sequence abandon --why "not today"', "leaves undone: Run the suite, Tag the release", actor=story.agent)
    story.expect_text('sequence abandon --why "not today" --sure', "sequence 1 abandoned", actor=story.agent)
    story.expect_refusal("sequence next", "no sequence is running", actor=story.agent)


def test_a_sequence_has_its_title_and_steps_changed(new_story):
    story = sequence_story(new_story)
    story.run('sequence edit 1 --title "Shipping" --steps "Run it" "Tag it" "Tell them"', actor=story.user)
    story.expect_ordered_lines("sequence show 1", "sequence 1: Shipping, starts by hand only", "1. Run it", "2. Tag it", "3. Tell them", actor=story.user)


def test_a_sequence_is_deleted(new_story):
    story = sequence_story(new_story)
    story.run("sequence delete 1", actor=story.user)
    story.expect_absent("sequence list", "Release", actor=story.user)


def test_sequence_runs_lists_the_runs_still_going_with_their_step(new_story):
    story = sequence_story(new_story)
    story.expect_text("sequence-run list", "nothing found", actor=story.user)
    story.run("sequence run 1", actor=story.agent)
    story.expect_text("sequence-run list", "Release", actor=story.agent)
    story.run("sequence follow", actor=story.agent)
    story.run("sequence next", actor=story.agent)
    story.run("sequence follow", actor=story.agent)
    story.run("sequence next", actor=story.agent)
    story.expect_text("sequence-run list", "nothing found", actor=story.agent)


def triggered_story(new_story, *triggers: dict, guards: list[dict] | None = None):
    story = new_story(fixture=UserJoined)
    line = f'sequence make "Release" --steps "Run the suite | Tag the release" --triggers {shlex.quote(json.dumps(triggers))} --step-guards {shlex.quote(json.dumps(guards or []))}'
    story.expect_text(line, "sequence 1: Release", actor=story.user)
    return story


def post_tool(name: str, category: str, files: tuple[str, ...] = (), rows: tuple[dict, ...] = ()):
    return HookSamples.sample("post_tool_use", {"name": name, "category": category, "files": list(files), "shell": None, "diff": None, "diff_rows": list(rows)})


def running(story) -> bool:
    return "Release" in story.run("sequence-run list", actor=story.user).output_text or '"sequence_id": 1' in story.run("sequence-run list --json", actor=story.user).output_text


def test_a_text_an_edit_adds_starts_a_sequence(new_story):
    story = triggered_story(new_story, {"trigger_type": "file-text", "pattern": "*.py", "text": "TODO"})
    story.hook("s-1", post_tool("Edit", "edit", tuple(["a.py"]), tuple([{"line_type": "del", "line": 1, "text": "TODO old"}])))
    expect_absent_running(story)
    story.hook("s-1", post_tool("Edit", "edit", tuple(["a.py"]), tuple([{"line_type": "add", "line": 1, "text": "# TODO new"}])))
    expect_running(story)


def test_a_record_made_starts_a_sequence(new_story):
    story = triggered_story(new_story, {"trigger_type": "row", "event": "plan.create"})
    story.run('plan make "The rebuild" --environment main', actor=story.user)
    story.run_listeners()
    expect_running(story)


def test_a_running_sequence_is_not_started_again(new_story):
    story = triggered_story(new_story, {"trigger_type": "phrase", "text": "update"})
    story.hook("s-1", HookSamples.prompt("update"))
    story.expect_absent_hook_line("s-1", HookSamples.prompt("update"), "started by what just happened")


def test_a_trigger_of_no_known_kind_a_bad_pattern_and_a_missing_field_are_refused(new_story):
    story = new_story(fixture=UserJoined)
    for trigger, reason in (({"trigger_type": "moon"}, "moon is no type of trigger"), ({"trigger_type": "command", "pattern": "("}, "does not read"), ({"trigger_type": "phrase"}, "needs its text")):
        story.expect_refusal(f'sequence make "Bad" --steps "one" --triggers {shlex.quote(json.dumps([trigger]))}', reason, actor=story.user)


def test_a_sequence_with_triggers_says_it_starts_on_its_own(new_story):
    story = triggered_story(new_story, {"trigger_type": "phrase", "text": "update"})
    story.expect_text("sequence show 1", "starts on its own on 1 triggers", actor=story.user)


def test_a_step_that_holds_edits_refuses_them_until_the_next_step(new_story):
    story = triggered_story(new_story, guards=[{"file_edits_allowed": False, "allowed_commands": []}])
    story.run("sequence run 1", actor=story.agent)
    story.run("sequence follow", actor=story.agent)
    story.expect_hook_refusal("s-1", HookSamples.edit("a.py"), expected_nudge(STEP_EDIT_BAN))
    story.run("sequence next", actor=story.agent)
    story.run("sequence follow", actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.edit("a.py"))


def test_a_hook_with_no_change_to_the_sequences_reads_no_sequence_rows(new_story):
    story = triggered_story(new_story, {"trigger_type": "phrase", "text": "give me an update"}, guards=[{"file_edits_allowed": False, "allowed_commands": []}])
    story.run("sequence run 1", actor=story.agent)
    story.hook("s-1", HookSamples.prompt("carry on"))
    story.hook("s-1", HookSamples.edit("a.py"))
    database = story.container.get(Database)
    start = database.repeated_work.points()
    story.hook("s-1", HookSamples.prompt("carry on"))
    story.hook("s-1", HookSamples.edit("a.py"))
    expect_value(database.repeated_work.points().minus(start).tables["sequences"], 0)


def test_a_trigger_changed_between_two_hooks_is_seen_on_the_next_hook(new_story):
    story = triggered_story(new_story, {"trigger_type": "phrase", "text": "give me an update"})
    story.hook("s-1", HookSamples.prompt("ship it"))
    expect_absent_running(story)
    story.run(f"sequence edit 1 --triggers {shlex.quote(json.dumps([{'trigger_type': 'phrase', 'text': 'ship it'}]))}", actor=story.user)
    story.hook("s-1", HookSamples.prompt("ship it"))
    expect_running(story)


def test_a_step_guard_changed_between_two_hooks_is_seen_on_the_next_hook(new_story):
    story = triggered_story(new_story)
    story.run("sequence run 1", actor=story.agent)
    story.run("sequence follow", actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.edit("a.py"))
    story.run(f"sequence edit 1 --step-guards {shlex.quote(json.dumps([{'file_edits_allowed': False, 'allowed_commands': []}]))}", actor=story.user)
    story.expect_hook_refusal("s-1", HookSamples.edit("a.py"), expected_nudge(STEP_EDIT_BAN))


def test_step_guards_that_do_not_read_are_refused_when_written(new_story):
    story = new_story(fixture=UserJoined)
    base = 'sequence make "Release" --steps "Run the suite"'
    story.expect_refusal(f"{base} --step-guards not-json", "step guards are JSON", actor=story.user)
    story.expect_refusal(f"{base} --step-guards {shlex.quote(json.dumps({'a': 1}))}", "are a list", actor=story.user)
    story.expect_refusal(f"{base} --step-guards {shlex.quote(json.dumps([{'file_edits_allowed': False, 'allowed_commands': ['(']}]))}", "does not read", actor=story.user)



@pytest.fixture
def running_release(new_story):
    story = sequence_story(new_story)
    story.run("sequence run 1", actor=story.agent)
    return story


def expect_running(story) -> None:
    assert running(story)


def expect_absent_running(story) -> None:
    assert not running(story)


def expect_agent_id(story, number, expected) -> None:
    actual = story.container.get(Queries).query(SequenceRun).find(number).session_agent_id
    assert actual == expected, actual


def second_agent_story(new_story, role: str, session: str, *triggers: dict):
    story = triggered_story(new_story, *triggers)
    agent_id = story.new_row_id(f"agent start {session} claude {role} --parent {story.agent.id} --environment main")
    return story, agent_id


def expect_exclusive_run(story, agent_id: int) -> None:
    runs = list(story.story_rows(SequenceRun))
    assert [run.session_agent_id for run in runs] == [agent_id], runs


@pytest.mark.parametrize("role,session", [("helper", "s-2"), ("worker", "s-3")])
def test_a_phrase_a_helper_or_worker_receives_starts_the_sequence_on_that_agent_and_not_the_main_agent(new_story, role, session):
    story, agent_id = second_agent_story(new_story, role, session, {"trigger_type": "phrase", "text": "give me an update"})
    story.hook(session, HookSamples.prompt("give me an update"))
    expect_exclusive_run(story, agent_id)


@pytest.mark.parametrize("role,session", [("helper", "s-2"), ("worker", "s-3")])
def test_a_tool_a_helper_or_worker_used_starts_the_sequence_on_that_agent_and_not_the_main_agent(new_story, role, session):
    story, agent_id = second_agent_story(new_story, role, session, {"trigger_type": "tool", "tool": "Edit", "pattern": "migrations/"})
    story.hook(session, post_tool("Edit", "edit", tuple(["migrations/a.py"])))
    expect_exclusive_run(story, agent_id)
    story.hook(session, post_tool("Edit", "edit", tuple(["migrations/b.py"])))
    expect_exclusive_run(story, agent_id)
