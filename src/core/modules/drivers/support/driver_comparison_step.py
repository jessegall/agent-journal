import json
from dataclasses import replace

from engine.database.database import Database
from engine.agent_machine.step_result import StepResult
from engine.actor.actor import Actor
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.record.question import Question
from engine.agent_machine.record.refusal_counts import RefusalCounts
from engine.agent_stack.stack import Stack
from engine.agent_step.agent_view_reader import AgentViewReader
from engine.agent_step.frame_codec import FrameCodec
from engine.command.bus import Bus
from engine.driver.hook_event import HookEvent
from engine.driver.hook_reply import HookReply
from engine.driver.rule_answers import RuleAnswers
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.record_driver_comparison.record_driver_comparison import RecordDriverComparison
from core.modules.drivers.models.driver_comparison_stack import DriverComparisonStack
from core.modules.drivers.models.enums.difference_state import DifferenceState
from core.modules.drivers.support.compared_answer import ComparedAnswer
from core.modules.drivers.support.rule_hook import RuleHook
from core.modules.drivers.support.machine_assembly import MachineAssembly

INPUT_CHARACTERS_KEPT = 16_000


class DriverComparisonStep:
    """Answers a hook a second time with the new machine, beside the old walk and without acting (doc 1310
    section 13.3): the view is read as for a live step, with the comparison's own stack and counts and the
    needs and plans of every module, and both answers are saved with the comparison's stack after. No effect
    runs and no live block, wake, grant, job or process changes. Blocks the old walk opened are read as
    open, since both use one key."""

    def __init__(self, reader: AgentViewReader, assembly: MachineAssembly, queries: Queries, bus: Bus, rule_hook: RuleHook, database: Database) -> None:
        self.reader, self.assembly, self.queries, self.bus, self.rule_hook, self.database = reader, assembly, queries, bus, rule_hook, database

    # the new machine's step on the comparison's own stack, before anything of this hook is saved
    def stepped(self, event: HookEvent, agent: Agent, actor: Actor, answers: RuleAnswers) -> StepResult:
        question = Question.posed(event)
        self.rule_hook.keep_walk_answers(answers, question, agent.id)
        # the rule-backed lines read rows as the walk does, so the step runs in the agent's scope too; the need
        # sources read the rows the walk's rules read, which is the comparison's cost (doc 1310 section 13.4)
        with self.bus.scopes.command_scope((), actor, agent.environment_id), self.database.repeated_work.counted_separately():
            view = self.assembly.with_needs(self.comparison_view(agent.id, question), question)
            return self.assembly.machine(agent.role).step(view, question)

    def compared(self, event: HookEvent, agent: Agent, actor: Actor, answers: RuleAnswers, reply: HookReply, stepped: StepResult) -> None:
        old, new = ComparedAnswer.old(answers, reply), ComparedAnswer.new(stepped.record)
        event_text = json.dumps(event.raw, sort_keys=True, default=str)
        command = RecordDriverComparison(agent.id, new.slice_name() or old.slice_name(), event_text[:INPUT_CHARACTERS_KEPT], old.text, new.text, reply.hook_call_id,
                                         len(event_text) <= INPUT_CHARACTERS_KEPT, FrameCodec.encoded(stepped.stack.frames), stepped.record.counts.stop_refusals,
                                         stepped.record.counts.tool_refusals, DifferenceState.AGREED if old.agrees(new) else DifferenceState.UNEXPLAINED)
        try:
            self.bus.run(command, actor, environment_id=agent.environment_id)
        # the secrets guard refuses a row that holds a secret's value: the event is kept without its input, as one that cannot be replayed
        except Refusal:
            self.bus.run(replace(command, event_text=f"{event.program} {event.event.value}", is_replayable=False), actor, environment_id=agent.environment_id)

    def comparison_view(self, agent_id: int, question: Question) -> AgentView:
        view = self.reader.read(agent_id, question)
        stack = self.queries.query(DriverComparisonStack).filter(session_agent_id=agent_id).first()
        if stack is None:
            return view
        return replace(view, stack=Stack(FrameCodec.decoded(stack.frames)), counts=RefusalCounts(stack.stop_refusals, stack.tool_refusals, view.escalation))
