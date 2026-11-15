from engine.agent_machine.record.line import Line
from engine.enums.line_channel import LineChannel
from engine.enums.line_category import LineCategory
from core.modules.drivers.support.decision_assembler import MACHINE_SOURCE, DecisionAssembler


def line(text: str, source: str) -> Line:
    return Line("sample.key", text, LineCategory.STEERING, "sample.key", LineChannel.NOW, source)


def test_each_source_gets_one_record_of_its_lines_so_its_history_notes_it_and_a_line_with_no_source_is_the_machines():
    records = DecisionAssembler.line_records([line("one", "plans.focus"), line("two", "tasks.quiet"), line("three", "plans.focus"), line("four", "")])
    assert [(record.name, record.outcome, len(record.answer.agent_messages)) for record in records] == [
        ("plans.focus", "lines", 2), ("tasks.quiet", "lines", 1), (MACHINE_SOURCE, "lines", 1)]
