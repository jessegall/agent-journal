from journal.container import Container
from journal.http.controllers.agents import AgentController
from journal.http.controllers.attachments import AttachmentController
from journal.http.controllers.chart import ChartController
from journal.http.controllers.checks import CheckController
from journal.http.controllers.cli import CliController
from journal.http.controllers.comments import CommentController
from journal.http.controllers.docs import DocController
from journal.http.controllers.dumps import DumpController
from journal.http.controllers.entries import EntryController
from journal.http.controllers.environments import EnvironmentController
from journal.http.controllers.facts import FactController
from journal.http.controllers.hooks import HookController
from journal.http.controllers.journal import JournalController
from journal.http.controllers.mcp import McpController
from journal.http.controllers.messages import MessageController
from journal.http.controllers.migration import MigrationController
from journal.http.controllers.notices import NoticeController
from journal.http.controllers.nudges import NudgeController
from journal.http.controllers.outputs import OutputController
from journal.http.controllers.plans import PlanController
from journal.http.controllers.plugins import PluginController
from journal.http.controllers.profiles import ProfileController
from journal.http.controllers.project_files import ProjectFileController
from journal.http.controllers.questions import QuestionController
from journal.http.controllers.reactions import ReactionController
from journal.http.controllers.reminders import ReminderController
from journal.http.controllers.reports import ReportController
from journal.http.controllers.rules import RuleController
from journal.http.controllers.search import SearchController
from journal.http.controllers.secrets import SecretController
from journal.http.controllers.sequences import SequenceController
from journal.http.controllers.settings import SettingController
from journal.http.controllers.shares import ShareController
from journal.http.controllers.skills import SkillController
from journal.http.controllers.tasks import TaskController
from journal.http.controllers.templates import TemplateController
from journal.http.controllers.transcripts import TranscriptController
from journal.http.controllers.triggers import TriggerController
from journal.http.controllers.tunnel import TunnelController
from journal.http.controllers.updates import UpdateController
from journal.http.controllers.viewer import ViewerController
from journal.http.controllers.voices import VoiceController
from journal.http.controllers.workers import WorkerController
from journal.http.router import Router

API = "/journal"
"""The journal's API: the viewer, the phone's page and a plugin's program all speak it; the hook and the shim post to the root."""


class Routes:
    """Every path, in one place. A resource's fixed paths come before its numbered ones, so a word is never taken for an id."""

    def __init__(self, container: Container) -> None:
        self.container = container

    def mount(self, router: Router) -> Router:
        get = self.container.get
        router.post("/hooks/{agent}", get(HookController).receive)
        router.post("/cli", get(CliController).run)
        self.journal(router)
        self.work(router)
        self.chat(router)
        self.writing(router)
        self.memory(router)
        self.agents(router)
        self.sharing(router)
        self.extending(router)
        self.workflows(router)
        return router

    def journal(self, router: Router) -> None:
        get = self.container.get
        journal, settings, migration, entries = get(JournalController), get(SettingController), get(MigrationController), get(EntryController)
        router.get(f"{API}/viewer", get(ViewerController).show)
        for path, handler in (("manifest", journal.manifest), ("identity", journal.identity), ("health", journal.health), ("journals", journal.journals), ("summary", journal.summary), ("bar", journal.bar)):
            router.get(f"{API}/{path}", handler)
        router.get(f"{API}/settings", settings.index)
        router.post(f"{API}/settings", settings.store)
        router.get(f"{API}/updates", get(UpdateController).index)
        router.post(f"{API}/updates", get(UpdateController).update)
        router.get(f"{API}/migration", migration.show)
        router.post(f"{API}/migration/later", migration.later)
        router.post(f"{API}/migration/start", migration.start)
        router.get(f"{API}/entries", entries.index)
        router.get(f"{API}/entries/stream", entries.stream)
        router.get(f"{API}/outputs/{{id}}", get(OutputController).show)
        router.get(f"{API}/voices", get(VoiceController).index)
        router.post(f"{API}/voices/choose", get(VoiceController).choose)
        files = get(ProjectFileController)
        router.get(f"{API}/project-files", files.index)
        router.get(f"{API}/project-files/find", files.find)
        router.get(f"{API}/project-files/file", files.show)
        router.get(f"{API}/project-files/diff", files.diff)
        router.get(f"{API}/search", get(SearchController).index)
        router.get(f"{API}/attachments", get(AttachmentController).index)
        router.get(f"{API}/{{table}}/{{id}}/files/{{name}}", get(AttachmentController).file)
        environments = get(EnvironmentController)
        self.listed(router, "environments", environments)
        router.post(f"{API}/environments", environments.store)
        self.acts(router, "environments", environments, "launch", "stop", "remove")

    def work(self, router: Router) -> None:
        get = self.container.get
        tasks, plans, questions = get(TaskController), get(PlanController), get(QuestionController)
        self.resource(router, "tasks", tasks)
        self.acts(router, "tasks", tasks, "start", "finish", "reopen", "delete", "log")
        router.get(f"{API}/tasks/{{id}}/logs", tasks.logs)
        self.resource(router, "plans", plans)
        router.get(f"{API}/plans/{{id}}/tasks", plans.tasks_of)
        router.post(f"{API}/plans/{{id}}/tasks", plans.add_task)
        self.acts(router, "plans", plans, "approve", "start", "park", "finish", "abandon")
        self.listed(router, "questions", questions)
        router.post(f"{API}/questions", questions.store)
        self.acts(router, "questions", questions, "answer")
        checks, sequences, triggers = get(CheckController), get(SequenceController), get(TriggerController)
        self.listed(router, "checks", checks)
        router.post(f"{API}/checks/{{id}}", checks.update)
        self.acts(router, "checks", checks, "run")
        self.listed(router, "sequences", sequences)
        self.acts(router, "sequences", sequences, "starts", "steps")
        self.listed(router, "triggers", triggers)
        router.post(f"{API}/triggers/{{id}}", triggers.update)
        self.listed(router, "templates", get(TemplateController))
        self.listed(router, "workers", get(WorkerController))
        router.get(f"{API}/workers/{{id}}/transcript", get(TranscriptController).of_worker)

    def chat(self, router: Router) -> None:
        get = self.container.get
        messages, comments, notices = get(MessageController), get(CommentController), get(NoticeController)
        router.post(f"{API}/messages/read", messages.read_all)
        self.listed(router, "messages", messages)
        router.post(f"{API}/messages", messages.store)
        router.post(f"{API}/messages/{{id}}", messages.update)
        self.acts(router, "messages", messages, "read", "reply", "delete", "react", "press")
        router.post(f"{API}/messages/{{id}}/files", messages.attach)
        router.get(f"{API}/comments", comments.index)
        router.post(f"{API}/comments", comments.store)
        router.post(f"{API}/comments/{{id}}", comments.update)
        self.acts(router, "comments", comments, "delete")
        router.get(f"{API}/reactions", get(ReactionController).index)
        router.get(f"{API}/nudges", get(NudgeController).index)
        self.listed(router, "notices", notices)
        self.acts(router, "notices", notices, "close")

    def writing(self, router: Router) -> None:
        get = self.container.get
        docs, reports, dumps = get(DocController), get(ReportController), get(DumpController)
        router.get(f"{API}/docs/search", docs.located)
        self.resource(router, "docs", docs)
        self.acts(router, "docs", docs, "section")
        self.resource(router, "reports", reports)
        self.acts(router, "reports", reports, "section")
        self.listed(router, "dumps", dumps)
        router.post(f"{API}/dumps", dumps.store)
        router.post(f"{API}/dumps/{{id}}/files", dumps.attach)
        self.acts(router, "dumps", dumps, "choose", "decline", "direct", "answer", "name", "split", "dismiss", "stop", "remove", "reopen")

    def memory(self, router: Router) -> None:
        get = self.container.get
        for name, controller in (("facts", get(FactController)), ("rules", get(RuleController)), ("reminders", get(ReminderController))):
            self.resource(router, name, controller)
            self.acts(router, name, controller, "delete")

    def agents(self, router: Router) -> None:
        get = self.container.get
        agents, transcripts, skills = get(AgentController), get(TranscriptController), get(SkillController)
        router.get(f"{API}/agents/live", agents.live)
        router.get(f"{API}/agents/controls/{{provider}}", agents.controls)
        self.listed(router, "agents", agents)
        router.get(f"{API}/agents/{{id}}/edits", agents.edits)
        router.get(f"{API}/agents/{{id}}/edits/file", agents.edited_file)
        router.get(f"{API}/agents/{{id}}/terminal", agents.terminal)
        router.get(f"{API}/agents/{{id}}/transcript", transcripts.of_agent)
        router.get(f"{API}/agents/{{id}}/subagents/{{session}}/transcript", transcripts.of_subagent)
        self.acts(router, "agents", agents, "shell", "control")
        router.post(f"{API}/agents/{{id}}/skip-step", agents.skip_step)
        router.post(f"{API}/agents/{{id}}/end-sequence", agents.end_sequence)
        router.get(f"{API}/skills", skills.index)
        router.get(f"{API}/skills/{{name}}", skills.show)
        router.post(f"{API}/skills/{{name}}/load", skills.load)
        profiles = get(ProfileController)
        router.get(f"{API}/profiles", profiles.index)
        router.get(f"{API}/profiles/{{name}}", profiles.one)
        router.post(f"{API}/profiles/{{name}}", profiles.save)

    def sharing(self, router: Router) -> None:
        get = self.container.get
        shares, tunnel, secrets = get(ShareController), get(TunnelController), get(SecretController)
        router.get(f"{API}/shares/opens", shares.opens)
        self.listed(router, "shares", shares)
        router.post(f"{API}/shares", shares.store)
        self.acts(router, "shares", shares, "approve", "stop")
        for path, handler in (("", tunnel.show), ("/services", tunnel.services), ("/cause", tunnel.cause), ("/answering", tunnel.answering), ("/version", tunnel.version), ("/domains", tunnel.domains)):
            router.get(f"{API}/tunnel{path}", handler)
        for path, handler in (("/check", tunnel.check), ("/restart", tunnel.restart), ("/login", tunnel.login), ("/logout", tunnel.logout), ("/install", tunnel.install),
                              ("/update", tunnel.update), ("/release", tunnel.release), ("/readdress", tunnel.readdress)):
            router.post(f"{API}/tunnel{path}", handler)
        router.get(f"{API}/secrets/where", secrets.where)
        self.resource(router, "secrets", secrets)
        self.acts(router, "secrets", secrets, "fill", "delete", "restore", "login")
        for act, handler in (("allow-login", secrets.allow_login), ("revoke-login", secrets.revoke_login), ("forget-login", secrets.forget_login)):
            router.post(f"{API}/secrets/{{id}}/{act}", handler)

    def extending(self, router: Router) -> None:
        get = self.container.get
        plugins, mcp = get(PluginController), get(McpController)
        router.post(f"{API}/plugins/preview", plugins.preview)
        self.listed(router, "plugins", plugins)
        router.post(f"{API}/plugins", plugins.install)
        self.acts(router, "plugins", plugins, "configure", "enable", "disable", "upgrade", "remove", "purge")
        router.post(f"{API}/plugins/{{id}}/upgrade-preview", plugins.upgrade_preview)
        router.get(f"{API}/plugins/{{id}}/log", plugins.log)
        router.get(f"{API}/plugins/{{id}}/record", plugins.recorded)
        router.get(f"{API}/plugins/{{id}}/dashboard", plugins.dashboard)
        router.get(f"{API}/mcp", mcp.index)
        router.post(f"{API}/mcp/install", mcp.install)
        router.post(f"{API}/mcp/check", mcp.check)
        for act, handler in (("key", mcp.key), ("remove", mcp.remove), ("sign-in", mcp.sign_in)):
            router.post(f"{API}/mcp/{{name}}/{act}", handler)

    def workflows(self, router: Router) -> None:
        chart = self.container.get(ChartController)
        router.get(f"{API}/chart", chart.index)
        router.post(f"{API}/chart", chart.create)
        router.post(f"{API}/chart/try", chart.try_)
        router.get(f"{API}/chart/runs", chart.runs)
        router.post(f"{API}/chart/order", chart.order)
        router.get(f"{API}/chart/{{id}}", chart.one)
        router.get(f"{API}/chart/{{id}}/standing", chart.stands)
        router.post(f"{API}/chart/{{id}}", chart.save)
        for act, handler in (("reset", chart.reset), ("remove", chart.remove), ("off", chart.off), ("on", chart.on)):
            router.post(f"{API}/chart/{{id}}/{act}", handler)

    @staticmethod
    def listed(router: Router, name: str, controller) -> None:
        router.get(f"{API}/{name}", controller.index)
        router.get(f"{API}/{name}/{{id}}", controller.show)

    @classmethod
    def resource(cls, router: Router, name: str, controller) -> None:
        cls.listed(router, name, controller)
        router.post(f"{API}/{name}", controller.store)
        router.post(f"{API}/{name}/{{id}}", controller.update)

    @staticmethod
    def acts(router: Router, name: str, controller, *acts: str) -> None:
        """Each act on a row, a POST to its own path named as the controller's method."""
        for act in acts:
            router.post(f"{API}/{name}/{{id}}/{act}", getattr(controller, act))
