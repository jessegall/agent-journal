from engine.enums.agent_message_type import AgentMessageType
from engine.driver.agent_message import AgentMessage
from core.modules.drivers.support.message_log import MessageLog
from engine.time.clock import Clock
from engine.enums.line_channel import LineChannel
from dataclasses import replace

from engine.agent_machine.record.line import Line
from engine.actor.actor import Actor
from engine.agent_machine.decision_record import DecisionRecord
from engine.agent_machine.record.question import Question
from engine.agent_step.agent_view_reader import AgentViewReader
from engine.command.bus import Bus
from engine.driver.hook_event import HookEvent
from engine.driver.rule_answer import RuleAnswer
from engine.driver.rule_answers import RuleAnswers
from engine.driver.rule_record import RuleRecord
from engine.enums.decision_class import DecisionClass
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.assembled_answer import AssembledAnswer
from core.modules.drivers.support.assembled_step import AssembledStep
from core.modules.drivers.support.machine_assembly import MachineAssembly

MACHINE_SOURCE = "drivers.machine"


class DecisionAssembler:
    """Builds the one answer of a hook from the agent machine's step: its decision, lines and effects, with the
    lines held back by their intervals and turns."""

    def __init__(self, reader: AgentViewReader, assembly: MachineAssembly, bus: Bus, agent_messages: MessageLog, clock: Clock) -> None:
        self.reader, self.assembly, self.bus, self.agent_messages, self.clock = reader, assembly, bus, agent_messages, clock

    def assembled(self, event: HookEvent, agent: Agent, actor: Actor) -> AssembledAnswer:
        with self.bus.scopes.command_scope((), actor, agent.environment_id):
            question = Question.posed(event)
            view = self.assembly.with_states(self.reader.read(agent.id, question), question)
            step = self.assembly.machine(agent.role).step(view, question)
        answers = self.answers(step.record)
        answers = replace(answers, skipped_lines=self.agent_messages.skipped_lines(agent.id, answers, self.clock.timestamp()))
        return AssembledAnswer(answers, AssembledStep(view, step))

    # the answer of a step whose required effect failed and whose save was rolled back (doc 1310 section 4.9)
    @staticmethod
    def failed_effects(assembled: AssembledAnswer) -> RuleAnswers:
        if assembled.step is None:
            return assembled.answers
        view, record = assembled.step.view, assembled.step.step.record
        failed = [RuleRecord(type(effect).__name__, "refused", effect.failed(view, record)) for effect in record.allowed_effects if effect.is_required]
        return replace(assembled.answers, rules=[*failed, *assembled.answers.rules])

    @staticmethod
    def answers(record: DecisionRecord) -> RuleAnswers:
        is_refusal = record.decision.decision_class is not DecisionClass.ALLOW
        shown = record.shown_reason
        safety = (AgentMessage(shown.key, AgentMessageType.SAFETY_REFUSAL, shown.text),) if is_refusal and shown.is_safety else ()
        refusal = RuleAnswer(refusal=shown.text, agent_messages=safety)
        refusals = [RuleRecord(shown.key or MACHINE_SOURCE, refusal.outcome, refusal)] if is_refusal else []
        return RuleAnswers([*refusals, *DecisionAssembler.line_records(record.lines)], stop_checks=tuple(record.stop_checks))

    # one record of lines for each source of the step, under its key; a terminal line is printed to the terminal
    @staticmethod
    def line_records(lines: list[Line]) -> list[RuleRecord]:
        sources = list(dict.fromkeys(line.source_key for line in lines))
        records = []
        for source in sources:
            said = [line for line in lines if line.source_key == source]
            answer = RuleAnswer(agent_messages=tuple(line.said() for line in said if line.channel is not LineChannel.TERMINAL),
                                terminal="\n".join(line.text for line in said if line.channel is LineChannel.TERMINAL))
            records.append(RuleRecord(source or MACHINE_SOURCE, answer.outcome, answer))
        return records
