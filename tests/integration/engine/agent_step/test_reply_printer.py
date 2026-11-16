from dataclasses import replace

from engine.agent_stack.reason import Reason
from engine.agent_machine.decision import Decision
from engine.agent_machine.record.line import Line
from engine.agent_machine.record.rewrite import Rewrite
from engine.agent_step.reply_printer import ReplyPrinter
from engine.enums.decision_class import DecisionClass
from engine.enums.line_channel import LineChannel
from engine.enums.line_category import LineCategory
from engine.enums.transform_slot import TransformSlot
from engine.testing.agent_machine.question_samples import QuestionSamples
from engine.testing.agent_machine.record_samples import RecordSamples
from engine.testing.examples.hook_samples import HookSamples

EDIT = QuestionSamples.question(HookSamples.edit("a.py"))
LINE = Line("messages.delivery", "message 7 waits", LineCategory.INFORMATION, "", LineChannel.IMMEDIATE)


def test_an_allowed_call_prints_its_lines_and_the_rewrite_the_step_kept() -> None:
    record = replace(RecordSamples.record(EDIT, Decision.allowed()), lines=[LINE],
                     rewrite=Rewrite.replaced({"command": "journal-run 7"}, (TransformSlot.RUNNER,), "wraps the line", EDIT))
    reply = ReplyPrinter().encoded(record)
    assert (reply.refusal, list(reply.lines), dict(reply.updated_input)) == ("", ["message 7 waits"], {"command": "journal-run 7"})


def test_a_refused_call_prints_its_reason_and_keeps_its_lines() -> None:
    refusal = Reason("documents.open", DecisionClass.BLOCK, "documents.open", "close document 41 first")
    reply = ReplyPrinter().encoded(replace(RecordSamples.record(EDIT, Decision(DecisionClass.BLOCK, refusal)), lines=[LINE]))
    assert (reply.refusal, list(reply.labelled_lines)) == ("close document 41 first", ["journal: message 7 waits"])


def test_a_halt_prints_only_the_halt() -> None:
    halt = Reason("drivers.lockdown", DecisionClass.HALT, "safety.all", "the program is at its usage limit")
    reply = ReplyPrinter().encoded(RecordSamples.record(EDIT, Decision(DecisionClass.HALT, halt)))
    assert (reply.halt, reply.refusal, list(reply.lines)) == ("the program is at its usage limit", "", [])
