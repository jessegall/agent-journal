from journal.container import Container
from journal.http.router import Router
from journal.http.v3.documents_controller import DocumentsController
from journal.http.v3.migration_controller import MigrationController
from journal.http.v3.outputs_controller import OutputsController
from journal.http.v3.plugins_controller import PluginsController
from journal.http.v3.rows_controller import RowsController
from journal.http.v3.share_controller import ShareController
from journal.http.v3.transcript_controller import TranscriptController
from journal.http.v3.v3_controller import V3Controller

API = "/api"


class V3Routes:
    """Version 3's paths, scoped by the environment header; each fixed path is mounted before the type paths so it is never taken for a type."""

    def __init__(self, container: Container) -> None:
        self.container = container

    def mount(self, router: Router) -> Router:
        c = self.container.get(V3Controller)
        for path, handler in (("manifest", c.get_manifest), ("identity", c.get_identity), ("summary", c.get_summary), ("agents", c.get_agents), ("pages", c.get_pages), ("journals", c.get_journals),
                              ("new-feature", c.get_new_feature), ("upstream", c.get_empty), ("releases", c.get_empty_list), ("extension", c.get_empty), ("hosting", c.get_empty)):
            router.get(f"{API}/{path}", handler)
        router.post(f"{API}/identity", c.post_identity)
        router.get(f"{API}/agent-controls/{{provider}}", c.get_agent_controls)
        router.get(f"{API}/health", c.get_health)
        migration = self.container.get(MigrationController)
        router.get(f"{API}/migration", migration.get)
        router.post(f"{API}/migration/later", migration.later)
        router.post(f"{API}/migration/start", migration.start)
        router.get(f"{API}/bar", c.get_bar)
        router.get(f"{API}/settings", c.get_settings)
        router.post(f"{API}/settings", c.post_settings)
        router.post(f"{API}/mode", c.post_mode)
        router.get(f"{API}/output/{{n}}/read", self.container.get(OutputsController).read)
        router.get(f"{API}/events", c.get_events)
        router.get(f"{API}/stream", c.get_stream)
        router.get(f"{API}/files", c.get_empty)
        documents = self.container.get(DocumentsController)
        router.get(f"{API}/files/page", documents.files_page)
        router.get(f"{API}/doc/locate", documents.located)
        router.get(f"{API}/changes", c.get_empty_list)
        router.get(f"{API}/family", c.get_empty)
        router.get(f"{API}/skills", c.get_skills)
        router.get(f"{API}/skills/{{name}}", c.get_skill)
        router.post(f"{API}/skills/{{name}}/load", c.post_skill_load)
        router.get(f"{API}/project-files", c.get_project_files)
        router.get(f"{API}/project-files/find", c.get_project_files_find)
        router.get(f"{API}/file", c.get_file)
        router.get(f"{API}/diff", c.get_diff)
        router.post(f"{API}/console", c.post_console)
        router.get(f"{API}/agent/{{n}}/edits", c.get_agent_edits)
        router.get(f"{API}/agent/{{n}}/edits/older", c.get_agent_edits)
        router.get(f"{API}/agent/{{n}}/edits/file", c.get_agent_edited_file)
        router.get(f"{API}/agent/{{n}}/terminal", c.get_agent_terminal)
        transcripts = self.container.get(TranscriptController)
        router.get(f"{API}/agent/{{n}}/transcript", transcripts.agent)
        router.get(f"{API}/agent/{{n}}/subagent/{{session}}/transcript", transcripts.subagent)
        router.get(f"{API}/helper/{{n}}/transcript", transcripts.worker)
        router.post(f"{API}/agent/{{session}}/shell", c.post_agent_shell)
        router.post(f"{API}/agent/{{session}}/control", c.post_agent_control)
        sharing = self.container.get(ShareController)
        router.get(f"{API}/services", sharing.services)
        router.post(f"{API}/share/{{action}}", sharing.command)
        plugins = self.container.get(PluginsController)
        router.post(f"{API}/plugins/preview", plugins.preview)
        router.post(f"{API}/plugin/install", plugins.install)
        router.post(f"{API}/plugins/{{n}}/upgrade-preview", plugins.upgrade_preview)
        router.get(f"{API}/plugins/{{name}}/log", plugins.log)
        router.get(f"{API}/plugins/{{name}}/record", plugins.record_of)
        router.get(f"{API}/plugin/{{n}}/dashboard/{{name}}", plugins.dashboard)
        router.get(f"{API}/{{type}}", self.container.get(RowsController).index)
        router.post(f"{API}/{{type}}", c.post_create)
        router.get(f"{API}/{{type}}/{{n}}", c.get_one)
        router.get(f"{API}/{{type}}/{{n}}/choices", c.get_choices)
        router.post(f"{API}/{{type}}/read-all", c.post_read_all)
        router.post(f"{API}/{{type}}/{{n}}/upload", c.post_upload)
        router.get(f"{API}/{{type}}/{{n}}/files/{{name}}", c.get_attached_file)
        router.post(f"{API}/{{type}}/{{n}}/{{action}}", c.post_act)
        router.post(f"{API}/{{type}}/{{action}}", c.post_type_action)
        return router
