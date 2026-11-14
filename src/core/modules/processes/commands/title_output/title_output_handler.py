from dataclasses import replace

from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.processes.commands.title_output.title_output import TitleOutput
from core.modules.processes.models.output import Output
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.title_phrase import TitlePhrase


class TitleOutputHandler(Handler[TitleOutput, Output]):
    """Keeps the title an agent gives a run on its output, once it reads as a whole phrase."""

    command = TitleOutput

    def __init__(self, outputs: OutputQuery, repository: Repository) -> None:
        self.outputs, self.repository = outputs, repository

    def handle(self, command: TitleOutput, context: Context) -> Output:
        kept = self.outputs.process(command.process_id).first()
        if kept is None:
            raise Refusal(f"process {command.process_id} keeps no output", "a short run keeps none")
        return self.repository.save(replace(kept, title=TitlePhrase.checked(command.title)), context)
