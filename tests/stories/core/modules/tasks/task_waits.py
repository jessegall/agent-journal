from datetime import timedelta

from core.modules.agents.support.terminal_typing import TerminalTyping
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import AgentStarted


def posted(line):
    return HookSamples.shell(line, ShellPart("journal", CommandCategory.JOURNAL, line.split()[1:], subcommand=line.split()[1])).with_fields(event="post_tool_use")


class TwoTasks(StoryFixture):
    """Tasks 1, Cart, and 2, Tax, both open in main."""

    parent = AgentStarted

    def steps(self, story: Story) -> None:
        for title in ("Cart", "Tax"):
            story.run(f'task make "{title}" --environment main')

    def expect(self, story: Story) -> None:
        story.expect_success("task show 2", "title: Tax", "state: open")


def test_a_task_blocked_on_another_opens_by_itself_when_that_task_ends(new_story):
    story = new_story(fixture=TwoTasks)
    story.expect_success("task block 1 --on task:2", "state: blocked", "reason: waits on task 2")
    story.expect_success('task cancel 2 --reason "not needed"')
    story.expect_success("task show 1", "state: open")


def test_a_task_waiting_on_two_opens_only_when_both_have_ended(new_story):
    story = new_story(fixture=TwoTasks)
    story.run('task make "Totals" --environment main')
    story.run("task block 1 --on task:2 --on task:3")
    story.run('task cancel 2 --reason "no"')
    story.expect_success("task show 1", "state: blocked")
    story.run('task cancel 3 --reason "no"')
    story.expect_success("task show 1", "state: open")


def test_a_block_with_nothing_named_is_refused_and_says_how(new_story):
    story = new_story(fixture=TwoTasks)
    story.expect_refusal("task block 1", "say what it waits on")


def test_a_block_on_itself_a_missing_row_or_a_finished_row_is_refused(new_story):
    story = new_story(fixture=TwoTasks)
    story.expect_refusal("task block 1 --on task:1", "cannot wait on itself")
    story.expect_refusal("task block 1 --on task:99", "task 99 does not exist")
    story.expect_refusal("task block 1 --on shop:1", "gives nothing to wait on")
    story.run('task cancel 2 --reason "no"')
    story.expect_refusal("task block 1 --on task:2", "already")


def test_a_reason_in_words_is_opened_by_hand(new_story):
    story = new_story(fixture=TwoTasks)
    story.expect_success('task block 1 --reason "needs the price list"', "state: blocked", "reason: needs the price list")
    story.expect_success("task unblock 1", "state: open")


def test_unblocking_by_hand_ends_the_wait_so_a_later_end_changes_nothing(new_story):
    story = new_story(fixture=TwoTasks)
    story.run("task block 1 --on task:2")
    story.run("task unblock 1")
    story.run("task start 1", actor=story.agent)
    story.run('task cancel 2 --reason "no"')
    story.expect_success("task show 1", "state: started")


def test_a_wait_in_words_teaches_the_block_and_a_block_with_a_flag_does_not(new_story):
    story = new_story(fixture=TwoTasks)
    assert any("a wait is a block the journal can see" in line for line in story.hook("s-1", posted('journal task log 1 waiting for the keys')).lines)
    story.expect_absent_hook_line("s-1", posted('journal task block 1 --on task:2 waiting for the keys'), "a wait is a block")
    story.expect_absent_hook_line("s-1", posted('journal task log 1 the cart is done'), "a wait is a block")


def test_a_block_nothing_opens_is_named_and_one_with_a_wait_is_not(new_story):
    story = new_story(fixture=TwoTasks)
    story.run("task block 1 --on task:2")
    story.expect_absent_hook_line("s-1", posted("journal task list"), "blocked with nothing to open them")
    story.run('task block 2 --reason "needs a key"')
    assert any("blocked with nothing to open them: 2:" in line for line in story.hook("s-1", posted("journal task list")).lines)


def test_a_block_nothing_opens_is_named_again_after_five_closed_tasks_or_45_minutes_and_either_starts_both_again(new_story):
    story = new_story(fixture=TwoTasks)
    story.run('task block 2 --reason "needs a key"')
    named = lambda: any("blocked with nothing to open them: 2:" in line for line in story.hook("s-1", posted("journal task list")).lines)
    assert named()
    for number in range(3, 8):
        story.expect_success(f'task make "job {number}" --brief "a job" --environment main')
        story.clock.advance(timedelta(seconds=1))
        story.expect_success(f"task start {number}", actor=story.agent)
        story.expect_success(f"task close {number} --outcome done", actor=story.agent)
        assert named() == (number == 7), number
    story.clock.advance(timedelta(seconds=2699))
    assert not named()
    story.clock.advance(timedelta(seconds=1))
    assert named()


def test_a_stop_does_not_refuse_over_a_task_that_opens_by_itself(new_story):
    story = new_story(fixture=TwoTasks)
    story.run('task make "Waits" --environment main')
    story.run("task block 1 --on task:3")
    story.run("task block 2 --on task:3")
    story.run("task block 3 --until 'true'")
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_a_task_whose_brief_names_an_open_task_is_told_how_to_block_on_it(new_story):
    story = new_story(fixture=TwoTasks)
    story.run('task edit 1 --brief "Build on task 2 first"')
    story.run("task start 1", actor=story.agent)
    assert "task 1 names open task 2; if it waits on it: journal task block 1 --on task:2" in story.hook("s-1", posted("journal task start 1")).lines


def test_the_graph_names_what_waits_on_what_by_a_dependency_or_a_block(new_story):
    story = new_story(fixture=TwoTasks)
    story.run('task make "Totals" --environment main')
    story.run("task block 1 --on task:2")
    story.run("task depend 3 --on 2")
    story.expect_text("task graph --environment main", "1 waits on 2", "3 waits on 2", actor=story.agent)


def test_a_finished_task_leaves_the_graph(new_story):
    story = new_story(fixture=TwoTasks)
    story.run("task block 1 --on task:2")
    story.run('task cancel 2 --reason "no"')
    story.expect_text("task graph --environment main", "no task waits on another", actor=story.agent)


def test_a_block_that_would_make_a_loop_is_refused(new_story):
    story = new_story(fixture=TwoTasks)
    story.run("task block 1 --on task:2")
    story.expect_refusal("task block 2 --on task:1", "would be a loop")


def test_deleting_the_task_it_waits_on_opens_a_task(new_story):
    story = new_story(fixture=TwoTasks)
    story.run("task block 1 --on task:2")
    story.expect_success("task delete 2")
    story.expect_success("task show 1", "state: open")


def test_an_idle_agent_is_typed_that_its_task_opened_and_the_line_is_not_said_twice(new_story):
    story = new_story(fixture=TwoTasks)
    entered: list[tuple[int, str]] = []

    class KeptTyping(TerminalTyping):
        def __init__(self) -> None:
            pass

        def type_line(self, agent_id: int, line: str) -> None:
            entered.append((agent_id, line))

    story.container.bind(TerminalTyping, KeptTyping())
    story.run("task block 1 --on task:2")
    story.run('task cancel 2 --reason "no"')
    story.run_listeners()
    story.expect_rows(entered == [(story.agent.id, "[journal] task 1, Cart, is open again: what it waited on has ended")])
    story.expect_text(f"agent-line list --agent {story.agent.id} --state entered", "task 1, Cart, is open again")


def test_the_agent_is_told_when_a_wait_opens_a_task(new_story):
    story = new_story(fixture=TwoTasks)
    story.run("task block 1 --on task:2")
    story.run('task cancel 2 --reason "no"')
    story.expect_text(f"agent-line list --agent {story.agent.id}", "task 1, Cart, is open again")


def test_environment_cards_count_running_agents_and_unfinished_tasks(new_story):
    story = new_story(fixture=TwoTasks)
    story.run('task cancel 2 --reason "no"')
    story.expect_text("environment cards --json", '"running_agent_count": 1', '"unfinished_task_count": 1', actor=story.agent)


def test_a_comment_on_a_task_is_a_message_linked_to_it(new_story):
    story = new_story(fixture=TwoTasks)
    story.expect_text('task comment 1 "Check the rounding" --environment main', "comment written as message", actor=story.user)
    story.expect_text("task comments 1", "Check the rounding", actor=story.user)
    story.expect_refusal('task comment 1 " " --environment main', "give the comment's text", actor=story.user)
