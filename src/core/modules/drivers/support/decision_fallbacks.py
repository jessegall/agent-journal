from engine.driver.hook_event import HookEvent
from engine.driver.rule_answer import RuleAnswer
from engine.driver.rule_answers import RuleAnswers
from engine.driver.rule_record import RuleRecord
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.commands.request_agent_step.request_agent_step import RequestAgentStep

MISSED_CHECK = "drivers.missed-check"
BUSY_TEXT = "The journal changed while it checked this call: run it again."
TRIGGER_RULES = "triggers."
# a stop and a session start let through unchecked leave a durable step request, so a step decides again in one round
REQUESTING_EVENTS = (HookEventName.STOP, HookEventName.SESSION_START)


class DecisionFallbacks:
    """The answer of a hook whose check was lost twice, or once with no time left for a second (doc 1310
    section 6.6, row e): a tool call is refused as busy with nothing prepared, spent or counted; a prompt
    passes unless a trigger refused it in the fresh read; a stop and a session start pass with a step
    request; every other event is kept as an observation. No line or command of the discarded answer runs."""

    @staticmethod
    def missed_check(event: HookEvent, agent_id: int, answers: RuleAnswers) -> RuleAnswers:
        if event.event is HookEventName.PRE_TOOL_USE:
            return DecisionFallbacks.with_answer(answers, RuleAnswer(refusal=BUSY_TEXT))
        if event.event is HookEventName.PROMPT:
            triggers = [rule for rule in answers.answered if rule.name.startswith(TRIGGER_RULES) and rule.answer is not None and rule.answer.refusal]
            return DecisionFallbacks.with_answer(answers, RuleAnswer(refusal=triggers[0].answer.refusal) if triggers and triggers[0].answer is not None else RuleAnswer())
        if event.event in REQUESTING_EVENTS:
            return DecisionFallbacks.with_answer(answers, RuleAnswer(commands=tuple([RequestAgentStep(agent_id, MISSED_CHECK)])))
        return DecisionFallbacks.with_answer(answers, RuleAnswer())

    @staticmethod
    def with_answer(answers: RuleAnswers, answer: RuleAnswer) -> RuleAnswers:
        return RuleAnswers(answers.layers, [RuleRecord(MISSED_CHECK, MISSED_CHECK, answer.outcome, answer)])
