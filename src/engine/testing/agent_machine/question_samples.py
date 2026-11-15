from engine.agent_machine.record.question import Question
from engine.driver.hook_event import HookEvent
from engine.testing.examples.hook_sample import HookSample


class QuestionSamples:
    """The question a step is asked, built from the same hook samples stories send, so a unit test of the machine
    and a story read one event the same way."""

    @staticmethod
    def of(sample: HookSample) -> Question:
        return Question.of(HookEvent.parsed(sample.body))
