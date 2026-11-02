from argparse import ArgumentParser, Namespace

from core.base.agent_role import AgentRole
from core.base.caller.caller import Caller
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.project_paths import ProjectPaths
from core.base.environment_names import EnvironmentNames
from core.base.query.conditions.among import Among
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.hook_call import HookCall
from core.modules.processes.models.process import Process
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.question import Question
from core.modules.usage.support.tool_facts import ToolFacts

SHOWN_RUNS = 2
TURN_HOOKS = (HookEventName.PRE_TOOL_USE, HookEventName.STOP, HookEventName.PROMPT, HookEventName.SESSION_START)


class UsageToolSubcommand(ReadSubcommand[ToolFacts]):
    """`journal usage tool [--environment <name>]`: the tool the main agent last began, empty once it has
    stopped or a new turn began, and then what it waits for: the runs it left going and the questions it
    open_questions."""

    cli_name = "usage"
    name = "tool"

    def __init__(self, queries: Queries, environment_names: EnvironmentNames, processes: ProcessQuery, outputs: OutputQuery) -> None:
        self.queries, self.environment_names, self.processes, self.outputs = queries, environment_names, processes, outputs

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")

    def read(self, arguments: Namespace, caller: Caller) -> ToolFacts:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("the tool is shown for one environment", "name it with --environment")
        mains = self.queries.query(Agent).filter(environment_id=environment_id, role=AgentRole.MAIN).matching(IsNull("ended_at")).newest().page(1, 1).rows
        if not mains:
            return ToolFacts()
        calls = self.queries.query(HookCall).filter(agent_id=mains[0].id).matching(Among("hook", TURN_HOOKS)).newest().page(1, 1).rows
        if calls and calls[0].hook == HookEventName.PRE_TOOL_USE:
            return ToolFacts(" ".join(part for part in (calls[0].tool, ProjectPaths.short_paths(calls[0].summary)) if part))
        return ToolFacts(wait_target=" and ".join((*self.running_titles(mains[0].id), *self.open_question_lines(environment_id))))

    def running_titles(self, agent_id: int) -> tuple[str, ...]:
        return tuple(self.title(process) for process in self.processes.agent(agent_id).running().newest().page(1, SHOWN_RUNS).rows)

    def title(self, process: Process) -> str:
        kept = self.outputs.process(process.id).page(1, 1).rows
        return kept[0].title if kept and kept[0].title else process.line

    def open_question_lines(self, environment_id: int) -> list[str]:
        open_questions = self.queries.query(Question).filter(environment_id=environment_id, state=QuestionState.OPEN).oldest().page(1, SHOWN_RUNS)
        if open_questions.total > 1:
            return [f"your answers to {open_questions.total} questions"]
        return [f"your answer to question {question.id}" for question in open_questions.rows]

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ToolFacts):
            output.write(value.tool or (f"waiting for {value.wait_target}" if value.wait_target else ""), {"tool": value.tool, "wait_target": value.wait_target})
