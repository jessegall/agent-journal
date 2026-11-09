from core.base.actor import Actor
from core.base.command.context import Context
from core.base.database.database import Database
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.base.driver.driver_rules import DriverRules
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.rule_answers import RuleAnswers
from core.base.driver.rule_record import RuleRecord
from unittest.mock import patch
from core.modules.drivers.support.nudger import Nudger
from core.modules.drivers.support.line_typing import LineTyping
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder

QUEUED = NudgeDeclaration("sample.queued", NudgeType.NOTICE, "task {task} is queued for worker {worker}",
                          plural_text="tasks {task} are queued for worker {worker}", id_field="task")


def test_queued_declarations_merge_before_the_tool_hook_line_limit(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    nudger = story.container.get(Nudger)
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    with story.container.get(Database).transaction():
        for task in range(1, 5):
            nudger.send(story.agent.id, QUEUED, "sample.queued", context, task=task, worker=7)
    answer = story.hook("s-1", HookSamples.edit("cart.py"))
    expect_queued_lines(answer, ["tasks 1, 2, 3, 4 are queued for worker 7"])
    expect_queued_lines(story.hook("s-1", HookSamples.edit("cart.py")), [])


def test_separate_tick_answers_keep_their_declaration_until_a_tool_hook(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    for task in range(1, 5):
        answer = RuleAnswer.with_nudges(QUEUED.nudge(task=task, worker=8))
        answers = RuleAnswers(["lead"], [RuleRecord("sample.queued", "lead", answer.outcome, answer)])
        with patch.object(DriverRules, "ask", return_value=answers):
            story.hook("s-1", HookSamples.tick())
    current_answer = RuleAnswer.with_nudges(QUEUED.nudge(task=5, worker=8))
    with patch.object(DriverRules, "ask", return_value=RuleAnswers(["lead"], [RuleRecord("sample.queued", "lead", current_answer.outcome, current_answer)])):
        delivered = story.hook("s-1", HookSamples.edit("cart.py"))
    expect_queued_lines(delivered, ["tasks 5, 1, 2, 3, 4 are queued for worker 8"])


def expect_queued_lines(answer, expected):
    assert [line for line in answer.lines if "queued for worker" in line] == expected, answer


def test_raw_agent_text_is_read_by_its_row_number_on_a_hook_and_in_a_terminal(new_story, monkeypatch):
    story = new_story(fixture=StartedTaskBuilder)
    nudger = story.container.get(Nudger)
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    with story.container.get(Database).transaction():
        row = nudger.send_text(story.agent.id, "Private instructions from the caller", "sample.raw", context)
    reply = story.hook("s-1", HookSamples.prompt("Continue"))
    story.expect_rows("Private instructions from the caller" not in "\n".join(reply.lines), any("agent-line" in line for line in reply.lines))
    story.expect_text(f"agent-line show {row.id}", "Private instructions from the caller", actor=story.agent)
    terminal_lines = []
    monkeypatch.setattr(TerminalTyping, "type_line", lambda _self, terminal, text: terminal_lines.append(text))
    with story.container.get(Database).transaction():
        next_row = nudger.send_text(story.agent.id, "Another private instruction", "sample.raw", context)
    story.container.get(LineTyping).enter_line(next_row, Actor.core())
    story.expect_rows(terminal_lines == [f"[journal] agent-line:{next_row.id}"])
