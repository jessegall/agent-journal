from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.mcp.queries.mcp_server_query import McpServerQuery
from core.modules.mcp.support.server_catalogue import ServerCatalogue
from core.modules.tasks.models.task import Task
from core.modules.transcriptions.commands.request_transcription_fetch.request_transcription_fetch import RequestTranscriptionFetch
from core.modules.drivers.support.main_agent_line import MainAgentLine
from core.modules.transcriptions.support.transcription_nudges import LINE_SOURCE
from core.modules.transcriptions.support.transcription_nudges import TRANSCRIPTION_IMPORT_REQUEST


class RequestTranscriptionFetchHandler(Handler[RequestTranscriptionFetch, Task]):
    """Files a task and tells the main agent to bring in transcriptions from an installed server that has them."""

    command = RequestTranscriptionFetch

    def __init__(self, servers: McpServerQuery, catalogue: ServerCatalogue, repository: Repository, line: MainAgentLine) -> None:
        self.servers, self.catalogue, self.repository, self.line = servers, catalogue, repository, line

    def handle(self, command: RequestTranscriptionFetch, context: Context) -> Task:
        server = self.servers.find_name(command.server)
        if command.server not in {suggestion.name for suggestion in self.catalogue.with_transcripts()}:
            raise Refusal(f"{command.server} has no transcriptions to fetch")
        brief = (f"Use the tools of the MCP server {server.name} to find transcripts not yet here: journal transcription list shows those that are. "
                 f'Add each with journal transcription make "<title>" --text "<the whole transcript>" --source {server.name}.')
        task = self.repository.save(Task(creator_id=context.actor.id, title=f"Fetch transcriptions from {server.title}", brief=brief), context)
        self.line.send_nudge(TRANSCRIPTION_IMPORT_REQUEST.nudge(task=task.id), LINE_SOURCE, context)
        return task
