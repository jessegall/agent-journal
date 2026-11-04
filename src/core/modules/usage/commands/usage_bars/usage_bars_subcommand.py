from argparse import ArgumentParser, Namespace

from core.base.agent_role import AgentRole
from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.query.conditions.among import Among
from core.base.query.conditions.equal import Equal
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder
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

    def __init__(self, queries: Queries, tasks: TaskQuery, environment_names: EnvironmentNames) -> None:
        self.queries, self.tasks, self.environment_names = queries, tasks, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")

    def read(self, arguments: Namespace, caller: Caller) -> BarFacts:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("the bars are shown for one environment", "name it with --environment")
        agents = self.queries.query(Agent).filter(environment_id=environment_id).matching(IsNull("ended_at"))
        helpers = agents.matching(Equal("role", AgentRole.MAIN, negated=True)).page(1, PAGE_ROWS).total + self.ended_delegates(environment_id)
        tasks =self.tasks.environment(environment_id).unclosed().page(1, PAGE_ROWS).total
        waiting = self.queries.query(Question).filter(environment_id=environment_id, state=QuestionState.OPEN).page(1, PAGE_ROWS).total
        mains = MainAgentFinder.rows(self.queries, environment_id)
        started_tasks = self.tasks.holder(mains[0].id).started().descending("started_at").page(1, PAGE_ROWS).rows if mains else ()
        jobs = self.queries.query(ScheduledJob).filter(agent_id=mains[0].id).matching(IsNull("ended_at")).page(1, PAGE_ROWS).total if mains else 0
        return BarFacts(helpers, tasks, waiting, started_tasks[0].id if started_tasks else None, started_tasks[0].title if started_tasks else "", jobs)

    def ended_delegates(self, environment_id: int) -> int:
        holders = {task.delegated_to for task in self.tasks.environment(environment_id).unclosed().all_rows() if task.state in UNFINISHED_WORK_STATES and task.delegated_to is not None}
        return self.queries.query(Agent).matching(Among("id", sorted(holders))).matching(Greater("ended_at", "")).count()

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, BarFacts):
            output.write(f"{value.helpers} helpers, {value.tasks} tasks, {value.waiting} waiting", output.values(value))
