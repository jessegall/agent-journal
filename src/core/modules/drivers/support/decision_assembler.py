from dataclasses import replace

from engine.actor.actor import Actor
from engine.agent_machine.decision_record import DecisionRecord
from engine.agent_machine.record.question import Question
from engine.agent_step.agent_view_reader import AgentViewReader
from engine.command.bus import Bus
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.driver.rule_answer import RuleAnswer
from engine.driver.rule_answers import RuleAnswers
from engine.driver.rule_record import RuleRecord
from engine.enums.decision_class import DecisionClass
from engine.enums.line_category import LineCategory
from engine.enums.nudge_type import NudgeType
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.assembled_answer import AssembledAnswer
from core.modules.drivers.support.assembled_step import AssembledStep
from core.modules.drivers.support.contribution_slices import ContributionSlices
from core.modules.drivers.support.hook_rule_answers import HookRuleAnswers
from core.modules.drivers.support.machine_assembly import MachineAssembly
from core.modules.drivers.support.agent_slices import AgentSlices
from core.modules.drivers.support.walk_answer_policy import WALK_RANK, WalkAnswerPolicy

NEW_DRIVER_LAYER = "agent machine"
# the new driver's shown reason wins the reply's refusal over the walk's, as the fixed order puts the new reasons first
NEW_REFUSAL_PRIORITY = 1_000


class DecisionAssembler:
    """Builds the one answer of a hook while the old walk and the new driver both answer (doc 1310 section
    13.2): the old rules of the slices in force for the agent stand down, the new machine steps with its
    table cut to those slices and the walk's refusal as one of its reasons, and its decision, lines and
    effects join the walk's answers. An old command the new effects also give runs once, as the new one.
    With no slice in force it is the walk alone."""

    def __init__(self, slices: AgentSlices, contribution_slices: ContributionSlices, rule_answers: HookRuleAnswers, reader: AgentViewReader,
                 assembly: MachineAssembly, bus: Bus) -> None:
        self.slices, self.contribution_slices, self.rule_answers, self.reader, self.assembly, self.bus = slices, contribution_slices, rule_answers, reader, assembly, bus

    def assembled(self, event: HookEvent, agent: Agent, actor: Actor) -> AssembledAnswer:
        with self.bus.scopes.command_scope((), actor, agent.environment_id):
            active = self.slices.active(agent)
            if not active:
                return AssembledAnswer(self.rule_answers.evaluate(event, agent))
            question = Question.posed(event)
            view = self.reader.read(agent.id, question)
            pinned = self.slices.pinned(view, event, active)
            agent_slices = pinned & active
            answers = self.rule_answers.evaluate(event, agent, self.contribution_slices.machine_answered(agent_slices, agent.role))
            if not agent_slices:
                return AssembledAnswer(answers)
            view = self.assembly.with_sliced_needs(replace(view, pinned_slices=tuple(sorted(pinned))), question, agent_slices)
            step = self.assembly.sliced_machine(agent.role, agent_slices, WalkAnswerPolicy(answers, self.contribution_slices.blocking_rules())).step(view, question)
            new_commands = [command for effect in (*step.record.unconditional_effects, *step.record.admission_effects) for command in effect.commands(view, step.record)]
        return AssembledAnswer(self.merged(answers, step.record, new_commands), AssembledStep(view, step))

    # the answer of a step whose required effect failed and whose save was rolled back (doc 1310 section 4.9)
    @staticmethod
    def failed_effects(assembled: AssembledAnswer) -> RuleAnswers:
        if assembled.step is None:
            return assembled.answers
        view, record = assembled.step.view, assembled.step.step.record
        failed = [RuleRecord(type(effect).__name__, NEW_DRIVER_LAYER, "refused", effect.failed(view, record)) for effect in record.admission_effects if effect.is_required]
        return replace(assembled.answers, rules=[*failed, *assembled.answers.rules])

    def merged(self, answers: RuleAnswers, record: DecisionRecord, new_commands: list[Command[object]]) -> RuleAnswers:
        old_lines = {nudge.text for rule in answers.answered if rule.answer is not None for nudge in rule.answer.nudges}
        nudges = tuple(Nudge(line.key, NudgeType.STEERING if line.category is LineCategory.STEERING else NudgeType.NOTICE, line.text)
                       for line in record.lines if line.text not in old_lines)
        is_new_refusal = record.decision.decision_class is not DecisionClass.ALLOW and record.shown_reason.rank != WALK_RANK
        rules = [self.without_commands(rule, new_commands) for rule in answers.rules]
        if not nudges and not is_new_refusal:
            return replace(answers, rules=rules)
        answer = RuleAnswer(refusal=record.shown_reason.text if is_new_refusal else "", nudges=nudges, refusal_priority=NEW_REFUSAL_PRIORITY)
        return replace(answers, rules=[RuleRecord(record.shown_reason.key or NEW_DRIVER_LAYER, NEW_DRIVER_LAYER, answer.outcome, answer), *rules])

    @staticmethod
    def without_commands(rule: RuleRecord, new_commands: list[Command[object]]) -> RuleRecord:
        if rule.answer is None or not new_commands:
            return rule
        answer = replace(rule.answer, commands=[command for command in rule.answer.commands if command not in new_commands],
                         commands_unrefused=[command for command in rule.answer.commands_unrefused if command not in new_commands])
        return replace(rule, answer=answer)
