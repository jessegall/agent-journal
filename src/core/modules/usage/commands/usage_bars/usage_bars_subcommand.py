from argparse import Namespace

from core.base.agent_role import AgentRole
from core.base.caller.caller import Caller
from core.base.query.conditions.among import Among
from core.base.query.conditions.equal import Equal
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.plans.models.plan_task import PlanTask
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.question import Question
from core.modules.schedules.models.scheduled_job import ScheduledJob
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.usage.support.bar_facts import BarFacts

PAGE_ROWS = 1
UNFINISHED_WORK_STATES = (TaskState.OPEN, TaskState.STARTED, TaskState.TESTING)


class UsageBarsSubcommand(ReadSubcommand[BarFacts]):
    """`journal usage bars [--environment <name>]`: the counts and the current task the viewer's
    bars show, counted by the database."""

    cli_name = "usage"
    name = "bars"
    environment_refusal = "the bars are shown for one environment"

    def __init__(self, queries: Queries, tasks: TaskQuery) -> None:
        self.queries, self.tasks = queries, tasks

    def read(self, arguments: Namespace, caller: Caller) -> BarFacts:
        agents = self.queries.query(Agent).matching(IsNull("ended_at"))
        helpers = agents.matching(Equal("role", AgentRole.MAIN, negated=True)).page(1, PAGE_ROWS).total + self.ended_delegates()
        tasks =self.tasks.unclosed().page(1, PAGE_ROWS).total
        waiting = self.queries.query(Question).filter(state=QuestionState.OPEN).page(1, PAGE_ROWS).total
        mains = MainAgentFinder.rows(self.queries)
        started_tasks = self.tasks.holder(mains[0].id).started().descending("started_at").page(1, PAGE_ROWS).rows if mains else ()
        jobs = self.queries.query(ScheduledJob).filter(agent_id=mains[0].id).matching(IsNull("ended_at")).page(1, PAGE_ROWS).total if mains else 0
        processes = self.queries.query(Process).matching(Among("state", RUNNING_STATES)).matching(IsNull("queued_at")).page(1, PAGE_ROWS).total
        plans = self.queries.query(PlanTask).filter(task_id=started_tasks[0].id).page(1, PAGE_ROWS).rows if started_tasks else ()
        return BarFacts(helpers, tasks, waiting, started_tasks[0].id if started_tasks else None, started_tasks[0].title if started_tasks else "", jobs, processes,
                        plans[0].plan_id if plans else None)

    def ended_delegates(self) -> int:
        holders = {task.delegated_to for task in self.tasks.unclosed().all_rows() if task.state in UNFINISHED_WORK_STATES and task.delegated_to is not None}
        return self.queries.query(Agent).matching(Among("id", sorted(holders))).matching(Greater("ended_at", "")).count()

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, BarFacts):
            output.write(f"{value.helpers} helpers, {value.tasks} tasks, {value.waiting} waiting", output.values(value))
