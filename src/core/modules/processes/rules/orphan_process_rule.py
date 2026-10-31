from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.commands.end_process import EndProcess
from core.modules.processes.commands.end_process_part import EndProcessPart
from core.modules.processes.commands.orphan_process import OrphanProcess
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.models.process import Process
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_settings import ProcessSettings


class OrphanProcessRule(DriverRule):
    """On each tick, a run of the agent whose shell has given no sign of life for longer than the limit is
    ended lost and the agent is told; a run whose folder holds an end the server never heard of is ended
    from the folder."""

    name = "processes.orphan-process"
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, processes: ProcessQuery, parts: ProcessPartQuery, folder: OutputFolder, settings: ProcessSettings) -> None:
        self.processes, self.parts, self.folder, self.settings = processes, parts, folder, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        answer = RuleAnswer.allowed()
        for process in tuple(self.processes.agent(hook.agent_id).running().oldest().all_rows()):
            answer = self.checked(answer, hook, process)
        return answer

    def checked(self, answer: RuleAnswer, hook: AgentHook, process: Process) -> RuleAnswer:
        code = self.folder.end(process.id)
        if code is not None:
            return answer.running(*self.parts_ended(process), self.ended(process, code))
        last_sign = self.folder.heartbeat(process.id) or process.created_at
        if last_sign is None or last_sign.elapsed_seconds(hook.timestamp) <= self.settings.integer(ProcessSetting.ORPHAN_SECONDS, hook.environment_id):
            return answer
        line = f"process {process.id} was lost: its shell is gone; journal output read {process.id} --summary"
        return RuleAnswer(refusal=answer.refusal, lines=[*answer.lines, line], commands=[*answer.commands, OrphanProcess(process.id)])

    def parts_ended(self, process: Process) -> list[EndProcessPart]:
        ended: list[EndProcessPart] = []
        for part in self.parts.process(process.id).all_rows():
            status = self.folder.status(process.id, part.position)
            if part.ended_at is None and status is not None:
                ended.append(EndProcessPart(process.id, part.position, status))
        return ended

    def ended(self, process: Process, code: int) -> EndProcess:
        byte_count, line_count = self.folder.sizes(process.id)
        return EndProcess(process.id, code, byte_count, line_count)
