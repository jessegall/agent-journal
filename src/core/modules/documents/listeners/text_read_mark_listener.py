import shlex
from argparse import ArgumentError
from pathlib import PurePath

from engine.enums.agent_role import AgentRole
from core.base.change.changed import Changed
from core.base.change.logged_event import LoggedEvent
from core.base.driver.hook_event_name import HookEventName
from engine.query.conditions.maximum import Maximum
from core.modules.agents.models.agent import Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.report import Report
from core.modules.documents.models.enums.text_mark_type import TextMarkType
from core.modules.documents.models.enums.text_mark_variant import TextMarkVariant
from core.modules.documents.support.text_lines import TextLines
from core.modules.drivers.models.hook_call import HookCall
from core.modules.processes.models.enums.part_state import PartState
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart

READ_MODELS = {Doc.cli_name: Doc, Report.cli_name: Report}
READ_LABELS = {Doc.cli_name: "document", Report.cli_name: "report"}


class TextReadMarkListener(MarkListener[Changed[ProcessPart]]):
    """A successful document or report read shows once per main-agent turn for each part of a row read."""

    name = "documents.read-mark"
    module_name = "journal.core.documents"

    def handle(self, event: Changed[ProcessPart], logged: LoggedEvent) -> None:
        part = event.row
        if part.state is not PartState.FINISHED or part.exit_code != 0:
            return
        try:
            tokens = shlex.split(part.text)
        except ValueError:
            return
        if len(tokens) < 4 or PurePath(tokens[0]).name != "journal" or tokens[1] not in READ_MODELS or tokens[2] != "show" or not tokens[3].isdigit():
            return
        process = self.queries.query(Process).find(part.process_id)
        agent = self.event_rows.required(Agent, process.session_agent_id)
        if agent.role != AgentRole.MAIN:
            return
        try:
            read_part = TextLines.read_part(TextLines.read_arguments(tokens[4:]))
        except ArgumentError:
            return
        model, row_id = READ_MODELS[tokens[1]], int(tokens[3])
        if not self.queries.query(model).filter(id=row_id).exists():
            return
        prompt = self.queries.query(HookCall).filter(session_agent_id=agent.id, hook=HookEventName.PROMPT).matching(Maximum("created_at", process.creation_timestamp().text)).newest().first()
        key = f"text-read:{agent.id}:{prompt.id if prompt is not None else 0}:{model.model_name}:{row_id}:{read_part}"
        if self.queries.query(ChatMark).filter(key=key).exists():
            return
        self.show(logged, TextMarkType.READ, TextMarkVariant.READ, f"Read {READ_LABELS[tokens[1]]} {row_id} ({read_part})", agent.id, model.model_name, row_id, key=key)
