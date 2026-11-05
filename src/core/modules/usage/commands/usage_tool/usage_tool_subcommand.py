from argparse import ArgumentParser, Namespace
from collections.abc import Sequence

from core.base.caller.caller import Caller
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.project_paths import ProjectPaths
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.drivers.models.hook_call import HookCall
from core.modules.processes.models.enums.part_state import PartState
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.question import Question
from core.modules.usage.support.tool_facts import ToolFacts
from core.modules.agents.support.main_agent_finder import MainAgentFinder

SHOWN_RUNS = 2
QUEUE_LINE = "waiting for a spot in the queue"
IDLE_NOTE = "has run no command yet"
TURN_HOOKS = (HookEventName.PRE_TOOL_USE, HookEventName.STOP, HookEventName.PROMPT, HookEventName.SESSION_START)


class UsageToolSubcommand(ReadSubcommand[ToolFacts]):
    """`journal usage tool [--environment <name>] [--agent <n>]`: the tool the main agent, or the agent named,
    last began, empty once it has stopped or a new turn began, and then what it waits for: the runs it left
    going and, for the main agent, the open questions."""

    cli_name = "usage"
    disabled_scopes = [ActorScope]
    name = "tool"
    environment_refusal = "the tool is shown for one environment"

    def __init__(self, queries: Queries, processes: ProcessQuery, outputs: OutputQuery) -> None:
        self.queries, self.processes, self.outputs = queries, processes, outputs

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--agent", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> ToolFacts:
        if arguments.agent is not None:
            return self.agent_tool(arguments.agent, ())
        environment_id = caller.environment_id
        mains = MainAgentFinder.rows(self.queries)
        if not mains:
            return ToolFacts()
        return self.agent_tool(mains[0].id, self.open_question_lines(environment_id, mains[0].id))

    def agent_tool(self, agent_id: int, question_lines: Sequence[str]) -> ToolFacts:
        calls = self.queries.query(HookCall).filter(agent_id=agent_id).matching(Among("hook", TURN_HOOKS)).newest().limited(1)
        if calls and calls[0].hook == HookEventName.PRE_TOOL_USE:
            return ToolFacts(" ".join(part for part in (calls[0].tool, ProjectPaths.short_paths(self.running_part_text(calls[0]) or calls[0].summary), self.line_changes(calls[0])) if part))
        wait_target = " and ".join((*self.running_titles(agent_id), *question_lines))
        has_run_command = self.queries.query(HookCall).filter(agent_id=agent_id, hook=HookEventName.PRE_TOOL_USE).exists()
        return ToolFacts(wait_target=wait_target, note="" if wait_target or has_run_command else IDLE_NOTE, thinking=bool(calls) and calls[0].hook == HookEventName.PROMPT, asking=bool(question_lines))

    def running_part_text(self, call: HookCall) -> str:
        runs = self.processes.agent(call.agent_id).newest().limited(1)
        if not runs or runs[0].creation_timestamp().value < call.creation_timestamp().value:
            return ""
        if runs[0].queued_at is not None:
            return QUEUE_LINE
        parts = tuple(self.queries.query(ProcessPart).filter(process_id=runs[0].id).ordered("position").all_rows())
        return next((part.text for state in (PartState.RUNNING, PartState.WAITING) for part in parts if part.state is state), parts[-1].text if parts else "")

    def line_changes(self, call: HookCall) -> str:
        return f"+{call.lines_added} -{call.lines_removed}" if call.lines_added or call.lines_removed else ""

    def running_titles(self, agent_id: int) -> tuple[str, ...]:
        return tuple(self.title(process) for process in self.processes.agent(agent_id).running().newest().page(1, SHOWN_RUNS).rows)

    def title(self, process: Process) -> str:
        kept = self.outputs.process(process.id).limited(1)
        return kept[0].title if kept and kept[0].title else process.line

    def open_question_lines(self, environment_id: int, agent_id: int) -> list[str]:
        open_questions = self.queries.query(Question).filter(agent_id=agent_id, state=QuestionState.OPEN).oldest().page(1, SHOWN_RUNS)
        if open_questions.total > 1:
            return [f"your answers to {open_questions.total} questions"]
        return [f"your answer to question {question.id}" for question in open_questions.rows]

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ToolFacts):
            output.write(value.tool or (f"waiting for {value.wait_target}" if value.wait_target else value.note), {"tool": value.tool, "wait_target": value.wait_target, "note": value.note, "thinking": value.thinking, "asking": value.asking})
