from journal.container import Container
from journal.http.router import Router
from journal.http.v3.v3_controller import V3Controller

API = "/api"


class V3Routes:
    """Version 3's paths, mounted after version 4's own so a fixed path is never taken for an environment's."""

    def __init__(self, container: Container) -> None:
        self.container = container

    def mount(self, router: Router) -> Router:
        c = self.container.get(V3Controller)
        for path, handler in (("manifest", c.get_manifest), ("identity", c.get_identity), ("summary", c.get_summary), ("agents", c.get_agents), ("pages", c.get_pages), ("journals", c.get_journals),
                              ("new-feature", c.get_new_feature), ("upstream", c.get_empty), ("releases", c.get_empty_list), ("services", c.get_empty_list), ("extension", c.get_empty), ("hosting", c.get_empty)):
            router.get(f"{API}/{path}", handler)
        router.post(f"{API}/identity", c.post_identity)
        router.get(f"{API}/{{env}}/health", c.get_health)
        router.get(f"{API}/{{env}}/bar", c.get_bar)
        router.get(f"{API}/{{env}}/settings", c.get_settings)
        router.post(f"{API}/{{env}}/settings", c.post_settings)
        router.get(f"{API}/{{env}}/events", c.get_events)
        router.get(f"{API}/{{env}}/stream", c.get_stream)
        router.get(f"{API}/{{env}}/dashboard", c.get_dashboard)
        router.get(f"{API}/{{env}}/files", c.get_empty)
        router.get(f"{API}/{{env}}/changes", c.get_empty_list)
        router.get(f"{API}/{{env}}/family", c.get_empty)
        router.get(f"{API}/{{env}}/skills", c.get_skills)
        router.get(f"{API}/{{env}}/skills/{{name}}", c.get_skill)
        router.post(f"{API}/{{env}}/skills/{{name}}/load", c.post_skill_load)
        router.get(f"{API}/{{env}}/project-files", c.get_project_files)
        router.get(f"{API}/{{env}}/project-files/find", c.get_project_files_find)
        router.get(f"{API}/{{env}}/file", c.get_file)
        router.get(f"{API}/{{env}}/diff", c.get_diff)
        router.post(f"{API}/{{env}}/console", c.post_console)
        router.get(f"{API}/{{env}}/agent/{{n}}/edits", c.get_agent_edits)
        router.get(f"{API}/{{env}}/agent/{{n}}/edits/older", c.get_agent_edits)
        router.get(f"{API}/{{env}}/agent/{{n}}/edits/file", c.get_agent_edited_file)
        router.get(f"{API}/{{env}}/agent/{{n}}/terminal", c.get_agent_terminal)
        router.get(f"{API}/{{env}}/agent/{{n}}/transcript", c.get_agent_transcript)
        router.post(f"{API}/{{env}}/agent/{{session}}/shell", c.post_agent_shell)
        router.get(f"{API}/{{env}}/{{type}}", c.get_list)
        router.post(f"{API}/{{env}}/{{type}}", c.post_create)
        router.get(f"{API}/{{env}}/{{type}}/{{n}}", c.get_one)
        router.get(f"{API}/{{env}}/{{type}}/{{n}}/choices", c.get_choices)
        router.post(f"{API}/{{env}}/{{type}}/read-all", c.post_read_all)
        router.post(f"{API}/{{env}}/{{type}}/{{n}}/upload", c.post_upload)
        router.get(f"{API}/{{env}}/{{type}}/{{n}}/files/{{name}}", c.get_attached_file)
        router.post(f"{API}/{{env}}/{{type}}/{{n}}/{{action}}", c.post_act)
        router.post(f"{API}/{{env}}/{{type}}/{{action}}", c.post_type_action)
        return router
