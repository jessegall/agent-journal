from argparse import Namespace
from dataclasses import asdict

from core.base.caller.caller import Caller
from core.base.refusal import Refusal
from core.base.request_queue import RequestQueue
from core.base.request_queue_entry import RequestQueueEntry
from core.base.request_queue_status import RequestQueueStatus
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.developer.support.developer_settings import HOOK_REQUEST_LOG_SETTING, TOOLS_SETTING
from core.modules.settings.bindings.support.setting_values import SettingValues


class RequestQueueSubcommand(ReadSubcommand[RequestQueueStatus]):
    cli_name = "developer"
    name = "request-queue"

    def __init__(self, queue: RequestQueue, agents: AgentRows, settings: SettingValues) -> None:
        self.queue, self.agents, self.settings = queue, agents, settings

    def read(self, arguments: Namespace, caller: Caller) -> RequestQueueStatus:
        if not self.settings.flag(TOOLS_SETTING) or not self.settings.flag(HOOK_REQUEST_LOG_SETTING):
            raise Refusal("the request log is off", "turn on the request log in developer settings")
        return self.queue.read()

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, RequestQueueStatus):
            return
        data = asdict(value)
        data["running"] = [self.entry(entry) for entry in value.running]
        data["waiting"] = [self.entry(entry) for entry in value.waiting]
        lines = ["Request queue"]
        for state in ("running", "waiting"):
            entries = data[state]
            if not entries:
                lines.append(f"{state}: nothing")
            lines.extend(f"{state}: {entry['sender']}  {entry['event']}  {entry['waited_ms']:.0f} ms" for entry in entries)
        output.write("\n".join(lines), data)

    def entry(self, entry: RequestQueueEntry) -> dict[str, object]:
        agent = self.agents.session(entry.session) if entry.session else None
        sender = entry.sender
        if agent is None:
            return {**asdict(entry), "sender": sender}
        if agent.role.lower() == sender.lower():
            sender = f"{sender} {agent.id}"
        return {**asdict(entry), "sender": sender}
