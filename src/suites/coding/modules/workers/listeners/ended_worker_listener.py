from suites.coding.modules.workers.types.worker import Worker
from core.modules.agents.events.agent_ended import AgentEnded
from engine.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from engine.scope.scopes import Scopes
from core.modules.drivers.support.main_agent_line import MainAgentLine
from engine.driver.message_sender import MessageSender
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.support.worker_job import ENDED_WORKER_SOURCE, UNFINISHED_TASKS_SOURCE
from suites.coding.modules.workers.agent_messages.worker_committed_unmerged_message import WorkerCommittedUnmergedMessage
from suites.coding.modules.workers.agent_messages.ended_worker_tasks_message import EndedWorkerTasksMessage
from suites.coding.modules.workers.agent_messages.worker_launch_failed_message import WorkerLaunchFailedMessage
from suites.coding.modules.workers.agent_messages.worker_restarted_message import WorkerRestartedMessage
from suites.coding.modules.workers.agent_messages.worker_unfinished_tasks_message import WorkerUnfinishedTasksMessage
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_handoff import WorkerHandoff
from suites.coding.modules.workers.support.worker_launch_failures import WorkerLaunchFailures
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks
from engine.command.context import Context
from suites.coding.modules.workers.support.worker_resume import WorkerResume
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.models.enums.stop_line_target import StopLineTarget
from suites.coding.modules.workers.models.enums.stop_reading import StopReading
from suites.coding.modules.workers.support.stop_facts import StopFacts
from suites.coding.modules.workers.support.stop_facts_reader import StopFactsReader
from suites.coding.modules.workers.listeners.support.worker_program_wait import WorkerProgramWait

SOURCE = ENDED_WORKER_SOURCE


class EndedWorkerListener(SaveListener[AgentEnded]):
    """A worker that ends with delegated tasks unfinished is told to carry on, which resumes it, so its main
    agent gets one quiet line; one that ended while its tests wait gets its next task from them, and one
    that ended while a run of its own goes is started again when the run ends. A worker that ended while its
    hand-in is under way leaves its main agent no line, and a program that ended within seconds of its start
    is reported to the main agent as a launch failure, with the error it wrote. A worker that stops while a
    run of its own goes leaves its main agent no line, however often it has stopped, unless a user or
    another agent stopped it. A worker a user or another agent stopped holds no delegated task or was
    ended by them and one that reported being stuck leave one line naming all its tasks through the merger;
    one that keeps ending with no run going leaves its main agent that line itself, once, since nobody else
    can start it. The line that tells a worker to carry on names every task it holds. A stop with tasks of a
    started plan whose work is committed leaves a second line that says their code is not merged."""

    name = "workers.ended-worker"
    disabled_scopes = [ActorScope]

    def __init__(self, message_sender: MessageSender, queries: Queries, unfinished: WorkerUnfinishedTasks, stop: WorkerStop, resume: WorkerResume, waits: WorkerProgramWait, inbox: MergerInbox, scopes: Scopes, handoff: WorkerHandoff, launches: WorkerLaunchFailures, guidance: WorkerGuidance, main_line: MainAgentLine, stop_facts: StopFactsReader) -> None:
        self.guidance, self.main_line, self.stop_facts = guidance, main_line, stop_facts
        self.message_sender, self.queries, self.unfinished, self.stop = message_sender, queries, unfinished, stop
        self.resume, self.waits, self.inbox, self.scopes = resume, waits, inbox, scopes
        self.handoff, self.launches = handoff, launches

    def handle(self, event: AgentEnded, context: Context) -> None:
        new = event.row
        if new.role != Worker.key or new.parent_id is None:
            return
        worker_round = self.unfinished.steps.round(new.id)
        facts = self.stop_facts.read(new, worker_round, context.actor.id)
        if facts is None:
            return
        stop_case = facts.reading()
        if stop_case.resumes_worker:
            self.message_sender.send(new.id, WorkerUnfinishedTasksMessage.declared(), UNFINISHED_TASKS_SOURCE, context, tasks=facts.task_names, line=self.guidance.round_point(worker_round).line)
        if stop_case is StopReading.RESUMED_PROGRAM_STARTING:
            self.waits.notify_wait(new, context)
        if stop_case.line_target is None:
            return
        with self.scopes.row_scope(new):
            self.send_lines(new, stop_case, facts, context)

    def send_lines(self, worker: Agent, stop_case: StopReading, facts: StopFacts, context: Context) -> None:
        if stop_case is StopReading.LAUNCH_FAILURE:
            self.message_sender.send(worker.parent_id, WorkerLaunchFailedMessage.declared(), SOURCE, context, worker=worker.id, line=self.launches.error_text(worker))
            return
        declaration = WorkerRestartedMessage.declared() if stop_case.resumes_worker else EndedWorkerTasksMessage.declared()
        lines = [declaration.agent_message(worker=worker.id, tasks=facts.task_names)]
        if facts.committed_names:
            lines.append(WorkerCommittedUnmergedMessage.declared().agent_message(worker=worker.id, tasks=facts.committed_names))
        receiver = self.main_line if stop_case.line_target is StopLineTarget.MAIN_AGENT else self.inbox
        for line in lines:
            receiver.send_agent_message(line, SOURCE, context)
