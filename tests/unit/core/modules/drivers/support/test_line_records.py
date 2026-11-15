from engine.agent_machine.record.line import Line
from engine.enums.line_carrier import LineCarrier
from engine.enums.line_category import LineCategory
from core.modules.drivers.support.decision_assembler import NEW_DRIVER_LAYER, DecisionAssembler


def line(text: str, source: str) -> Line:
    return Line("sample.key", text, LineCategory.STEERING, "sample.key", LineCarrier.NOW, source)


def test_each_old_rule_a_source_answers_for_gets_its_own_record_with_no_layer_so_its_history_notes_it():
    records = DecisionAssembler.line_records([line("one", "plans.focus"), line("two", "tasks.quiet"), line("three", "plans.focus"), line("four", "")])
    assert [(record.name, record.layer, record.outcome, len(record.answer.nudges)) for record in records] == [
        ("plans.focus", "", "lines", 2), ("tasks.quiet", "", "lines", 1), (NEW_DRIVER_LAYER, NEW_DRIVER_LAYER, "lines", 1)]
