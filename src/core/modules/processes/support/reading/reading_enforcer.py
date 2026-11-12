import re
from dataclasses import replace

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.command.context import Context
from engine.driver.agent_hook import AgentHook
from engine.driver.block_until import BlockUntil
from engine.driver.conditions.time_reached import TimeReached
from engine.driver.interval import Interval
from engine.driver.nudge import Nudge
from engine.driver.part import Part
from engine.driver.shell_line import ShellLine
from engine.driver.rule_answer import RuleAnswer
from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.time.clock import Clock
from core.modules.drivers.support.block_conditions.any_condition import AnyCondition
from core.modules.processes.commands.send_reader_request_notice.send_reader_request_notice import SendReaderRequestNotice
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.block_conditions.reader_request_completed import ReaderRequestCompleted
from core.modules.processes.support.reader_request_notices import ReaderRequestNotices
from core.modules.processes.support.reader_request_text import ReaderRequestText
from core.modules.processes.support.reader_save_attempts import ReaderSaveAttempts
from core.modules.processes.support.reader_writers import ReaderWriters
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.queries.reading_decision_query import ReadingDecisionQuery
from core.modules.processes.support.decisions.escalation_counter import EscalationCounter
from core.modules.processes.support.decisions.reading_decider import PREVENT_AFTER_RUNS
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_nudges import (REDIRECTED_RUN, READER_BLOCK, READER_REQUEST_COUNTDOWN, READER_REQUEST_REFUSAL, READER_REQUEST_SPAN,
                                                          READING_PREVENTED, SILENT_START_FIXED, SILENT_START_READY, SILENT_START_REFUSED, SILENT_START_TAUGHT)
from core.modules.processes.support.reader_rows import ReaderRows
from core.modules.processes.support.reader_selection import ReaderSelection
from core.modules.processes.support.unreadable.unreadable_marks import UnreadableMarks
from core.modules.processes.support.run_shapes import RunShapes
from core.modules.processes.support.silent_run import SilentRun
from core.modules.processes.support.silent_start_runs import SilentStartRuns

OPEN_REQUESTS_REASON = "the main agent is told of every open reader request that needs help or ran out of time"

EXIT_COMMANDS = ("output read", "output peek", "output page", "output stop", "reader", "refusal skip", "command-type")
UNKNOWN_SHAPE = "none of the known ones"
MISSING_TOTAL_TEXT = "states no total, so the command must print one first"
SILENT_RUN_LIMIT_COUNT = 2
STANDARD_OUTPUT_REDIRECT = re.compile(r"(?:1?>>?|&>>?)\s*[^&\s]")


class ReadingEnforcer:
    """The one place that presses an agent about reading, at the start of a command, by its command key: after one
    silent run it teaches the shape found, after two it refuses the start until a reader is made or changed or the
    agent skips once with a reason, and says once that progress shows when a later run does; any other command
    that ended twice without a good reader is refused its next start with every exit stated. A command marked
    unreadable is asked nothing, and a command that takes an exit always passes. It also makes and dispatches the
    blocks of a reader request: the agent that must have the reader is held until the request is completed or
    expires, and the main agent is asked to help after failed saves."""

    def __init__(self, runs: SilentStartRuns, folder: OutputFolder, readers: ReaderRows, marks: UnreadableMarks, counter: EscalationCounter,
                 decisions: ReadingDecisionQuery, requests: ReaderRequestQuery, request_text: ReaderRequestText, notices: ReaderRequestNotices,
                 writers: ReaderWriters, attempts: ReaderSaveAttempts, bus: Bus, clock: Clock) -> None:
        self.runs, self.folder, self.readers, self.marks, self.counter, self.decisions = runs, folder, readers, marks, counter, decisions
        self.requests, self.request_text, self.notices, self.writers, self.attempts = requests, request_text, notices, writers, attempts
        self.bus, self.clock = bus, clock

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error or ReadingEnforcer.answers_exit(hook):
            return RuleAnswer.allowed()
        redirected = list(dict.fromkeys(part.program for part in shell.parts if self.is_redirected(part, shell)))
        if redirected:
            return RuleAnswer.refused(REDIRECTED_RUN.nudge(programs=', '.join(redirected)))
        names = tuple(dict.fromkeys(SilentStartRuns.name(part.text, part.program, part.classification.category) for part in shell.parts if self.is_watched(part)))
        answers = [self.answer_name(name) for name in names if not self.marks.excuses(name)]
        refused = next((answer for answer in answers if answer.refusal), None)
        if refused is not None:
            return refused
        return RuleAnswer.with_nudges(*(nudge for answer in answers for nudge in answer.nudges))

    @staticmethod
    def is_redirected(part: Part, shell: ShellLine) -> bool:
        """Whether a test run, a build or a check of the line sends its output to a file or to /dev/null, which no
        reader would see; its exit is to run it without the redirect."""
        return part.classification.category.is_watched and any(redirect in part.text and STANDARD_OUTPUT_REDIRECT.match(redirect) for redirect in shell.redirects)

    @staticmethod
    def is_watched(part: Part) -> bool:
        return part.classification.category.is_watched

    def answer_name(self, name: str) -> RuleAnswer:
        runs = self.runs.runs(name)
        count = SilentStartRuns.silent_run_count(runs)
        if count >= SILENT_RUN_LIMIT_COUNT:
            return self.silent_refusal(name, runs[0])
        if count:
            return RuleAnswer.with_nudges(self.taught(name, runs[0]))
        if len(runs) > 1 and runs[0].shows_percent and runs[1].is_silent:
            return RuleAnswer.with_nudges(SILENT_START_FIXED.nudge(name=name))
        if self.counter.runs_without_change([name])[name] >= PREVENT_AFTER_RUNS:
            return self.prevented(name)
        return RuleAnswer.allowed()

    def taught(self, name: str, run: SilentRun) -> Nudge:
        shape = RunShapes.found(self.folder.all_output(run.process.id))
        return SILENT_START_TAUGHT.nudge(name=name, seconds=run.seconds, shape=shape.label if shape else UNKNOWN_SHAPE, hint=shape.total_note if shape else MISSING_TOTAL_TEXT)

    def silent_refusal(self, name: str, run: SilentRun) -> RuleAnswer:
        if self.reader_changed_after(run):
            return RuleAnswer.allowed()
        refused = SILENT_START_REFUSED.nudge(name=name)
        shape = RunShapes.found(self.folder.all_output(run.process.id))
        if shape is None:
            return RuleAnswer.refused(refused)
        ready = SILENT_START_READY.nudge(name=name, shape=shape.label, reader=f'journal reader add {name.split()[-1]} --commands "{run.part.command or run.part.text}" --title "{name}" {shape.reader_options()}')
        return RuleAnswer(refusal=refused.text, nudges=(refused, ready), last=True)

    def prevented(self, name: str) -> RuleAnswer:
        """The start of a command that ended twice without a good reader is refused, naming the last of those runs
        and every exit of a prevent."""
        last = self.decisions.for_command_key(name).filter(moment=ReadingMoment.END).descending("decided_at", "id").first()
        output = last.process_id if last is not None else 0
        return RuleAnswer.refused(READING_PREVENTED.nudge(output=output, name=name))

    def reader_changed_after(self, run: SilentRun) -> bool:
        selected = ReaderSelection.choose(self.readers.all(), [run.part], self.readers.layers())
        return selected is not None and run.process.created_at is not None and selected.reader.update_timestamp().value > run.process.created_at.value

    @staticmethod
    def answers_exit(hook: AgentHook) -> bool:
        """Whether the hook runs only commands that take an exit: reading or stopping the run, writing or marking a
        reader, skipping, or saying what type a command is."""
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        return shell is not None and shell.is_journal_command_line(*EXIT_COMMANDS)

    def block_for_request(self, process: Process, part: ProcessPart, context: Context) -> None:
        """Holds the agent of a run whose part opened a reader request until the request is completed or expires."""
        request = self.requests.find(part.reader_request_id)
        if request.completed_at is not None or request.expires_at <= self.clock.timestamp():
            return
        nudge = READER_BLOCK.nudge(output=part.process_id, request=request.id)
        ends = AnyCondition(ReaderRequestCompleted(request.id), TimeReached(request.expires_at.text))
        self.bus.dispatch(BlockUntil(process.session_agent_id, replace(nudge, key=f"{nudge.key}.{request.id}"), ends), context)

    def request_answer(self, hook: AgentHook) -> RuleAnswer:
        """The lines of the reader requests an agent waits on; for the main agent also the block that asks it to help
        with a request whose saves failed or whose time ran out."""
        if not hook.event.accepts_lines:
            return RuleAnswer.allowed()
        if hook.role != AgentRole.MAIN:
            return RuleAnswer.with_nudges(*(self.request_text.line(request) for request in self.writers.agent_requests(Actor(hook.agent_id, ActorType.AGENT))))
        waiting = tuple(request for request in self.requests.open().every_row(OPEN_REQUESTS_REASON)
                        if (self.attempts.needs_help(request) or request.expires_at <= hook.timestamp)
                        if not self.notices.has_recent_notice(hook.agent_id, request.id, hook.timestamp))
        blocks = tuple(self.help_block(hook.agent_id, request) for request in waiting)
        if hook.event.event is HookEventName.TICK:
            return RuleAnswer.allowed().running(*blocks, *(SendReaderRequestNotice(hook.agent_id, request.id) for request in waiting))
        return RuleAnswer.with_nudges(*(self.request_text.line(request) for request in waiting)).running(*blocks)

    @staticmethod
    def help_block(agent_id: int, request: ReaderRequest) -> BlockUntil:
        refusal = READER_REQUEST_REFUSAL.nudge(request=request.id, command=request.command, block="{block}")
        countdown = READER_REQUEST_COUNTDOWN.nudge("{left}", command=request.command)
        return BlockUntil(agent_id, replace(refusal, key=f"{refusal.key}.{request.id}"), ReaderRequestCompleted(request.id),
                          after=Interval(READER_REQUEST_SPAN), countdown=countdown)
