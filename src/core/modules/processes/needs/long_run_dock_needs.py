from collections.abc import Mapping, Sequence

from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.need import Need
from engine.agent_machine.needs.need_source import NeedSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.states.blocked import Blocked
from engine.agent_stack.subject_reference import SubjectReference
from core.modules.processes.nudges.run_name_nudge import RunNameNudge
from core.modules.processes.support.run_docking import LONG_RUN_DOCK_KEY, RunDocking
from core.modules.processes.support.block_conditions.output_titled import OutputTitled
from core.modules.processes.support.run_title import RunTitle

OUTPUT_TITLE_RANK = "processes.output-title"
# a docked run with no descriptive title holds the agent's tools after this many uses (doc 1310 section 4.6)
TITLE_GRACE_USES = 5


class LongRunDockNeeds(NeedSource):
    """Plans the hold on each docked run whose output has no descriptive title (doc 1310 section 4.6, the
    required command row): the docked run is the request, its tools held after five uses until journal output
    title, never a line that counts. LongRunDockEffect docks the run, as today's rule does."""

    replaced_rules = tuple([LONG_RUN_DOCK_KEY])
    state_type = Blocked
    rank = OUTPUT_TITLE_RANK

    def __init__(self, docking: RunDocking) -> None:
        self.docking = docking

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[Need | BlockPlan]]:
        plans: dict[int, list[Need | BlockPlan]] = {}
        for agent in agents:
            docked = list(self.docking.docked_runs(agent.agent_id))
            if not docked:
                continue
            outputs = self.docking.run_outputs(tuple(run.id for run in docked))
            untitled = [run for run in docked if run.id in outputs and not RunTitle.is_descriptive(outputs[run.id].title, run.line)]
            if untitled:
                plans[agent.agent_id] = [self.plan(run.id) for run in untitled]
        return plans

    @staticmethod
    def plan(process_id: int) -> BlockPlan:
        return BlockPlan(RunNameNudge.declared().nudge(process=process_id), OutputTitled(process_id), LONG_RUN_DOCK_KEY, OUTPUT_TITLE_RANK,
                         tool_grace_uses=TITLE_GRACE_USES, subject=SubjectReference("process", process_id), lifting_lines=tuple([f"journal output title {process_id}"]))
