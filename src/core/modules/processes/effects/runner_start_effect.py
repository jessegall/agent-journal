from collections.abc import Mapping, Sequence

from engine.agent.agent_checkouts import AgentCheckouts
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.effect import Effect
from engine.agent_machine.decision_record import DecisionRecord
from engine.command.command import Command
from engine.enums.effect_timing import EffectTiming
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.models.process import Process
from core.modules.processes.nudges.runner_start_failed_message import RunnerStartFailedMessage
from core.modules.processes.support.run_count_lines import RunCountLines
from core.modules.processes.support.runner_binary import RunnerBinary
from core.modules.processes.support.runner_line import RunnerLine
from core.modules.processes.support.runner_plan import RUNNER_REWRITE_KEY, RunnerDecision, RunnerPlan

BACKGROUND_FLAG = "run_in_background"


class RunnerStartEffect(Effect):
    """An admitted shell line is made a process, split into its parts, in the step's own write, and is run through
    the journal's runner with that process, its limit and its line (doc 1310 section 4.1 points 5 and 6). The line
    is the final one, after the transforms; a run that cannot be made withdraws the admission."""

    events = [HookEventName.PRE_TOOL_USE]
    timing = EffectTiming.ON_ADMISSION
    is_required = True
    failure = RunnerStartFailedMessage

    def __init__(self, plan: RunnerPlan, runner: RunnerBinary, count_lines: RunCountLines, checkouts: AgentCheckouts) -> None:
        self.plan, self.runner, self.count_lines, self.checkouts = plan, runner, count_lines, checkouts

    def commands(self, view: AgentView, record: DecisionRecord) -> Sequence[Command[object]]:
        decision = self.decision(view, record)
        event = record.action.event
        if decision.run is None or decision.shell is None or event is None:
            return []
        return [StartProcess.build(view.agent.agent_id, event, decision.shell, decision.run)]

    def input_after(self, view: AgentView, record: DecisionRecord, results: Sequence[object]) -> Mapping[str, object] | None:
        process = next((made for made in results if isinstance(made, Process)), None)
        decision = self.decision(view, record)
        event = record.action.event
        if process is None or decision.run is None or decision.shell is None or event is None:
            return None
        run = self.count_lines.counted(decision.run, process)
        given = record.rewrite.tool_input if record.rewrite.tool_input is not None else event.tool_input()
        kept = {str(field): value for field, value in given.items() if field != BACKGROUND_FLAG}
        line = RunnerLine.build(self.runner.path, process.id, process.claim_token, run, decision.shell.runner_text, event.session, self.checkouts.checkout(view.agent.agent_id))
        return {**kept, "command": line}

    # the plan of the final line, after the transforms rewrote it
    def decision(self, view: AgentView, record: DecisionRecord) -> RunnerDecision:
        final = record.rewrite.final_question(record.action)
        tool = final.tool()
        event = record.action.event
        firing = event.firing if event is not None else ""
        return self.plan.decision(tool.shell if tool is not None else None, firing, view.agent.agent_id)
