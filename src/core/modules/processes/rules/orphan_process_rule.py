from core.modules.processes.support.process_nudges import PROCESS_MISSING
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.interval import Interval
from engine.driver.rule_answer import RuleAnswer
from engine.driver.span_queries import SpanQueries
from core.modules.processes.commands.orphan_process.orphan_process import OrphanProcess
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.models.process import Process
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.rules.support.run_folder_ends import RunFolderEnds


TICK_INTERVAL_SECONDS = 150


class OrphanProcessRule(DriverRule):
    """On each tick, a run the agent started whose shell has given no sign of life for longer than the limit, or
    whose runner pid is gone for the lost runner seconds, is ended lost and the agent is told; a run whose folder holds an end the server
    never heard of is ended from the folder. The first tick after a long gap, a machine that slept, ends
    nothing lost, since no heartbeat could have been written either."""

    name = "processes.orphan-process"
    hook = HookEventName.TICK
    drivers = ["*"]

    def __init__(self, processes: ProcessQuery, ends: RunFolderEnds, folder: OutputFolder, settings: ProcessSettings, spans: SpanQueries) -> None:
        self.processes, self.ends, self.folder, self.settings, self.spans = processes, ends, folder, settings, spans

    def answer(self, hook: AgentHook) -> RuleAnswer:
        answer = RuleAnswer.allowed()
        restarted = self.folder.tick_interval_seconds(hook.agent_id, hook.timestamp) > TICK_INTERVAL_SECONDS
        for process in tuple(self.processes.agent_started(hook.agent_id).running().oldest().all_rows()):
            answer = self.checked(answer, hook, process, restarted)
        return answer

    def checked(self, answer: RuleAnswer, hook: AgentHook, process: Process, restarted: bool) -> RuleAnswer:
        ended = self.ends.commands(process)
        if ended:
            return answer.running(*ended)
        last_sign = self.folder.heartbeat(process.id) or process.created_at
        pid_missing = self.folder.pid(process.id) is not None and not self.folder.has_leader_process(process.id)
        limit = Interval(self.settings.seconds(ProcessSetting.LOST_RUNNER_SECONDS if pid_missing else ProcessSetting.ORPHAN_SECONDS))
        if restarted or last_sign is None or not limit.has_passed(self.spans, hook.agent_id, last_sign, hook.timestamp):
            return answer
        return RuleAnswer(refusal=answer.refusal, nudges=[*answer.nudges, PROCESS_MISSING.nudge(process=process.id)], commands=[*answer.commands, OrphanProcess(process.id)])
