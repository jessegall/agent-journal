from argparse import ArgumentParser, Namespace
from collections.abc import Sequence

from engine.caller.caller import Caller
from engine.time.clock import Clock
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.project_paths import ProjectPaths
from core.base.provider.transcript_author import MONITOR_OPENINGS
from engine.query.conditions.among import Among
from engine.query.conditions.contains_some import ContainsSome
from engine.query.conditions.minimum import Minimum
from engine.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from engine.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import HookCall
from core.modules.processes.support.monitored_runs import MONITOR_LIFE_SECONDS, MONITOR_TOOL
from core.modules.processes.models.enums.part_state import PartState
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.questions.queries.question_query import QuestionQuery
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

    def __init__(self, queries: Queries, processes: ProcessQuery, outputs: OutputQuery, questions: QuestionQuery, clock: Clock) -> None:
        self.queries, self.processes, self.outputs, self.questions, self.clock = queries, processes, outputs, questions, clock

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--agent", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> ToolFacts:
        if arguments.agent is not None:
            return self.agent_tool(arguments.agent, ())
        main_agents = MainAgentFinder.rows(self.queries)
        if not main_agents:
            return ToolFacts()
        return self.agent_tool(main_agents[0].id, self.open_question_lines(main_agents[0].id))

    def agent_tool(self, agent_id: int, question_lines: Sequence[str]) -> ToolFacts:
        latest_call = self.queries.query(HookCall).filter(session_agent_id=agent_id).matching(Among("hook", TURN_HOOKS)).newest().first()
        if latest_call is not None and latest_call.hook == HookEventName.PRE_TOOL_USE:
            latest_run = self.run_after(latest_call)
            text = " ".join(part for part in (latest_call.tool, ProjectPaths.short_paths(self.running_part_text(latest_run) or latest_call.summary), self.line_changes(latest_call)) if part)
            return ToolFacts(text, running=latest_run is not None and latest_run.ended_at is None)
        wait_target = " and ".join(dict.fromkeys((*self.monitor_descriptions(agent_id), *self.running_titles(agent_id), *question_lines)))
        has_run_command = self.queries.query(HookCall).filter(session_agent_id=agent_id, hook=HookEventName.PRE_TOOL_USE).exists()
        return ToolFacts(wait_target=wait_target, note="" if wait_target or has_run_command else IDLE_NOTE, thinking=latest_call is not None and latest_call.hook == HookEventName.PROMPT, asking=bool(question_lines))

    def run_after(self, call: HookCall) -> Process | None:
        latest_run = self.processes.agent(call.session_agent_id).newest().first()
        return None if latest_run is None or latest_run.creation_timestamp().value < call.creation_timestamp().value else latest_run

    def running_part_text(self, latest_run: Process | None) -> str:
        if latest_run is None:
            return ""
        if latest_run.queued_at is not None:
            return QUEUE_LINE
        parts = tuple(self.queries.query(ProcessPart).filter(process_id=latest_run.id).ordered("position").all_rows())
        return next((part.text for state in (PartState.RUNNING, PartState.WAITING) for part in parts if part.state is state), parts[-1].text if parts else "")

    def line_changes(self, call: HookCall) -> str:
        return f"+{call.lines_added} -{call.lines_removed}" if call.lines_added or call.lines_removed else ""

    def monitor_descriptions(self, agent_id: int) -> tuple[str, ...]:
        calls = self.queries.query(HookCall).filter(session_agent_id=agent_id, hook=HookEventName.PRE_TOOL_USE, tool=MONITOR_TOOL, answer=HookAnswer.ALLOWED)
        notice = self.queries.query(HookCall).filter(session_agent_id=agent_id, hook=HookEventName.PROMPT).matching(ContainsSome(["summary"], list(MONITOR_OPENINGS))).newest().first()
        if notice is not None:
            calls = calls.matching(Minimum("created_at", notice.creation_timestamp().text))
        current = self.clock.timestamp()
        return tuple(text for call in calls.newest().page(1, SHOWN_RUNS).rows if call.creation_timestamp().elapsed_seconds(current) < MONITOR_LIFE_SECONDS
                     for text in [call.monitor_description] if text)

    def running_titles(self, agent_id: int) -> tuple[str, ...]:
        return tuple(self.title(process) for process in self.processes.agent(agent_id).running().newest().page(1, SHOWN_RUNS).rows)

    def title(self, process: Process) -> str:
        kept = self.outputs.process(process.id).first()
        return kept.title if kept is not None and kept.title else process.line

    def open_question_lines(self, agent_id: int) -> list[str]:
        open_questions = self.questions.agent(agent_id).open_questions().oldest().page(1, SHOWN_RUNS)
        if open_questions.total > 1:
            return [f"your answers to {open_questions.total} questions"]
        return [f"your answer to question {question.id}" for question in open_questions.rows]

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ToolFacts):
            output.write(value.tool or (f"waiting for {value.wait_target}" if value.wait_target else value.note), {"tool": value.tool, "wait_target": value.wait_target, "note": value.note, "thinking": value.thinking, "asking": value.asking, "running": value.running})
