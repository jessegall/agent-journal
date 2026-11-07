from core.base.change.event_type import EventType
from core.modules.processes.events.output_ended import OutputEnded
from core.modules.processes.events.process_ended import ProcessEnded


def test_an_ended_output_and_an_ended_process_have_their_patterns():
    assert EventType.parsed(OutputEnded).pattern(()) == "output.end"
    assert EventType.parsed(ProcessEnded).pattern(()) == "process.finish|process.fail|process.stop|process.orphan"
