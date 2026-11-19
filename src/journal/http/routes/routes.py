from journal.container import Container
from journal.http.controllers.agents import AgentController
from journal.http.controllers.attachments import AttachmentController
from journal.http.controllers.checks import CheckController
from journal.http.controllers.cli import CliController
from journal.http.controllers.docs import DocController
from journal.http.controllers.dumps import DumpController
from journal.http.controllers.entries import EntryController
from journal.http.controllers.environments import EnvironmentController
from journal.http.controllers.memories import MemoryController
from journal.http.controllers.hooks import HookController
from journal.http.controllers.journal import JournalController
from journal.http.controllers.mcp import McpController
from journal.http.controllers.messages import MessageController
from journal.http.controllers.migration import MigrationController
from journal.http.controllers.mode import ModeController
from journal.http.controllers.people import PeopleController
from journal.http.controllers.worktrees import WorktreeController
from journal.http.controllers.notices import NoticeController
from journal.http.controllers.suggestions import SuggestionController
from journal.http.controllers.nudges import NudgeController
from journal.http.controllers.git_hooks import GitHookController
from journal.http.controllers.outputs import OutputController
from journal.http.controllers.supervised_processes import SupervisedProcessController
from journal.http.controllers.docks import DockController
from journal.http.controllers.process_cards import ProcessCardController
from journal.http.controllers.nudge_counts import NudgeCountController
from journal.http.controllers.reader_measures import ReaderMeasureController
from journal.http.controllers.plans import PlanController
from journal.http.controllers.plugins import PluginController
from journal.http.controllers.git_overview import GitOverviewController
from journal.http.controllers.profiles import ProfileController
from journal.http.controllers.library import LibraryController
from journal.http.controllers.team import TeamController
from journal.http.controllers.project_files import ProjectFileController
from journal.http.controllers.questions import QuestionController
from journal.http.controllers.reactions import ReactionController
from journal.http.controllers.reminders import ReminderController
from journal.http.controllers.reports import ReportController
from journal.http.controllers.collections import CollectionController
from journal.http.controllers.rules import RuleController
from journal.http.controllers.search import SearchController
from journal.http.controllers.secrets import SecretController
from journal.http.controllers.sequences import SequenceController
from journal.http.controllers.settings import SettingController
from journal.http.controllers.services import ServiceController
from journal.http.controllers.shell import ShellController
from journal.http.controllers.shares import ShareController
from journal.http.controllers.skills import SkillController
from journal.http.controllers.tasks import TaskController
from journal.http.controllers.templates import TemplateController
from journal.http.controllers.transcripts import TranscriptController
from journal.http.controllers.triggers import TriggerController
from journal.http.controllers.tunnel import TunnelController
from journal.http.controllers.phones import PhoneController
from journal.http.controllers.updates import UpdateController
from journal.http.controllers.viewer import ViewerController
from journal.http.controllers.client_errors import ClientErrorController
from journal.http.controllers.voices import VoiceController
from journal.http.controllers.subagents import SubagentController
from journal.http.controllers.verifiers import VerifierController
from journal.http.controllers.reviewers import ReviewerController
from journal.http.controllers.test_turns import TestTurnController
from journal.http.controllers.worker_activity import WorkerActivityController
from journal.http.controllers.workers import WorkerController
from journal.http.router import Router

API = "/journal"


class Routes:
    """Every path, in one place. A resource's fixed paths come before its numbered ones, so a word is never taken for an id."""

    def __init__(self, container: Container) -> None:
        self.container = container

    def mount(self, router: Router) -> Router:
        get = self.container.get
        router.post("/hooks/{agent}", get(HookController).receive)
        router.post("/shell/run", get(ShellController).run)
        router.post("/cli", get(CliController).run)
        router.post("/cli/run", get(CliController).run_posted)
        self.journal(router)
        self.work(router)
        self.chat(router)
        self.writing(router)
        self.memory(router)
        self.agents(router)
        self.sharing(router)
        self.extending(router)
        return router

    def journal(self, router: Router) -> None:
        get = self.container.get
        journal, settings, migration, entries = get(JournalController), get(SettingController), get(MigrationController), get(EntryController)
        router.get(f"{API}/viewer", get(ViewerController).show)
        for path, handler in (("manifest", journal.manifest), ("identity", journal.identity), ("health", journal.health), ("journals", journal.journals), ("summary", journal.summary), ("bar", journal.bar), ("developer", journal.developer)):
            router.get(f"{API}/{path}", handler)
        router.post(f"{API}/developer/reset", journal.developer_reset)
        router.get(f"{API}/developer/nudges", get(NudgeCountController).index)
        router.post(f"{API}/developer/nudges/reset", get(NudgeCountController).reset)
        router.get(f"{API}/developer/readers", get(ReaderMeasureController).index)
        router.post(f"{API}/client-errors", get(ClientErrorController).store)
        router.get(f"{API}/settings", settings.index)
        router.post(f"{API}/settings", settings.store)
        router.get(f"{API}/updates", get(UpdateController).index)
        router.get(f"{API}/updates/changelog", get(UpdateController).changes)
        router.get_outward(f"{API}/updates/fresh", get(UpdateController).is_recent)
        router.post(f"{API}/updates", get(UpdateController).update)
        router.post(f"{API}/updates/force", get(UpdateController).force_update)
        router.post_unscoped(f"{API}/services", get(ServiceController).register)
        router.get(f"{API}/people", get(PeopleController).show)
        mode = get(ModeController)
        router.get(f"{API}/mode", mode.show)
        router.post(f"{API}/mode", mode.choose)
        router.get(f"{API}/migration", migration.show)
        router.post(f"{API}/migration/later", migration.postpone)
        router.post(f"{API}/migration/start", migration.start)
        router.get(f"{API}/entries", entries.index)
        router.get(f"{API}/entries/stream", entries.stream)
        router.get(f"{API}/cards/active", get(ProcessCardController).fields)
        router.get(f"{API}/outputs/running", get(OutputController).running)
        router.get(f"{API}/outputs/{{id}}", get(OutputController).show)
        router.get(f"{API}/supervised", get(SupervisedProcessController).index)
        router.post(f"{API}/outputs/{{id}}/stop", get(OutputController).stop)
        router.get(f"{API}/voices", get(VoiceController).index)
        router.post(f"{API}/voices/choose", get(VoiceController).choose)
        files = get(ProjectFileController)
        router.get(f"{API}/project-files", files.index)
        router.get(f"{API}/project-files/find", files.find)
        router.get(f"{API}/project-files/file", files.show)
        router.get(f"{API}/project-files/raw", files.raw)
        router.get(f"{API}/project-files/diff", files.diff)
        git = get(GitOverviewController)
        router.get(f"{API}/git/branches", git.branches)
        router.get(f"{API}/git/commits", git.commits)
        router.get(f"{API}/git/pulls", git.pulls)
        router.get(f"{API}/search", get(SearchController).index)
        router.get(f"{API}/attachments", get(AttachmentController).index)
        router.get(f"{API}/{{table}}/{{id}}/files/{{name}}", get(AttachmentController).file)
        router.post(f"{API}/docks/{{table}}/{{id}}", get(DockController).dock)
        router.post(f"{API}/docks/{{table}}/{{id}}/undock", get(DockController).undock)
        environments = get(EnvironmentController)
        router.get(f"{API}/environments/sessions", environments.sessions)
        router.get(f"{API}/environments/filling", environments.filling)
        self.listed(router, "environments", environments)
        router.post(f"{API}/environments", environments.store)
        self.acts(router, "environments", environments, "launch", "stop", "remove")
        router.post(f"{API}/environments/{{id}}/worktree-removal", environments.worktree_removal)
        worktrees = get(WorktreeController)
        router.get(f"{API}/worktrees", worktrees.index)
        router.post(f"{API}/worktrees/{{name}}/removal", worktrees.worktree_removal)

    def work(self, router: Router) -> None:
        get = self.container.get
        tasks, plans, questions = get(TaskController), get(PlanController), get(QuestionController)
        self.resource(router, "tasks", tasks)
        self.acts(router, "tasks", tasks, "start", "finish", "cancel", "reopen", "block", "unblock", "delete", "log")
        router.get(f"{API}/tasks/{{id}}/logs", tasks.logs)
        self.resource(router, "plans", plans)
        router.get(f"{API}/plans/{{id}}/tasks", plans.plan_tasks)
        router.get(f"{API}/plans/{{id}}/timeline", plans.timeline)
        router.post(f"{API}/plans/{{id}}/tasks", plans.add_task)
        router.post(f"{API}/plans/{{id}}/testing", plans.testing)
        router.get(f"{API}/plan-testing", plans.testing_templates)
        self.acts(router, "plans", plans, "review", "approve", "start", "pause", "finish", "abandon", "dismiss")
        self.listed(router, "questions", questions)
        router.post(f"{API}/questions", questions.store)
        self.acts(router, "questions", questions, "answer", "close")
        checks, sequences, triggers = get(CheckController), get(SequenceController), get(TriggerController)
        self.resource(router, "checks", checks)
        self.acts(router, "checks", checks, "run", "stop")
        router.get(f"{API}/git-hooks", get(GitHookController).index)
        self.listed(router, "sequences", sequences)
        router.post(f"{API}/sequences", sequences.store)
        self.acts(router, "sequences", sequences, "triggers", "steps")
        self.resource(router, "triggers", triggers)
        self.listed(router, "templates", get(TemplateController))
        router.get(f"{API}/workers/activity", get(WorkerActivityController).recent)
        self.listed(router, "workers", get(WorkerController))
        self.listed(router, "subagents", get(SubagentController))
        self.acts(router, "workers", get(WorkerController), "send", "message", "stop", "complete", "check", "short_check", "merge", "release")
        router.get(f"{API}/workers/{{id}}/transcript", get(TranscriptController).worker_transcript)
        self.listed(router, "verifiers", get(VerifierController))
        self.listed(router, "reviewers", get(ReviewerController))
        self.listed(router, "test_turns", get(TestTurnController))
        router.get(f"{API}/verifiers/{{id}}/transcript", get(TranscriptController).verifier_transcript)

    def chat(self, router: Router) -> None:
        get = self.container.get
        messages, notices = get(MessageController), get(NoticeController)
        router.post(f"{API}/messages/read", messages.read_all)
        router.get(f"{API}/messages/sent/{{key}}", messages.sent)
        self.listed(router, "messages", messages)
        router.post(f"{API}/messages", messages.store)
        router.post(f"{API}/messages/{{id}}", messages.update)
        self.acts(router, "messages", messages, "read", "reply", "delete", "react", "press", "dock", "unpin", "undock")
        router.post(f"{API}/messages/{{id}}/files", messages.attach)
        router.get(f"{API}/chats/{{session}}", messages.agent_chat)
        router.get(f"{API}/reactions", get(ReactionController).index)
        router.get(f"{API}/nudges", get(NudgeController).index)
        self.listed(router, "notices", notices)
        self.acts(router, "notices", notices, "close")
        self.listed(router, "suggestions", get(SuggestionController))
        self.acts(router, "suggestions", get(SuggestionController), "accept", "decline")

    def writing(self, router: Router) -> None:
        get = self.container.get
        docs, reports, dumps = get(DocController), get(ReportController), get(DumpController)
        router.get(f"{API}/docs/search", docs.located)
        self.resource(router, "docs", docs)
        self.acts(router, "docs", docs, "section")
        router.get(f"{API}/docs/{{id}}/revisions", docs.revision_list)
        router.post(f"{API}/docs/{{id}}/keep", docs.revision_close)
        router.get_outward(f"{API}/docs/{{id}}/export", docs.export)
        self.resource(router, "reports", reports)
        self.acts(router, "reports", reports, "section", "read")
        self.resource(router, "collections", get(CollectionController))
        router.get_outward(f"{API}/reports/{{id}}/export", reports.export)
        self.listed(router, "dumps", dumps)
        router.post(f"{API}/dumps", dumps.store)
        router.post(f"{API}/dumps/{{id}}/files", dumps.attach)
        self.acts(router, "dumps", dumps, "choose", "decline", "direct", "answer", "name", "split", "dismiss", "stop", "remove", "reopen")

    def memory(self, router: Router) -> None:
        get = self.container.get
        for name, controller in (("rules", get(RuleController)), ("reminders", get(ReminderController))):
            self.resource(router, name, controller)
            self.acts(router, name, controller, "delete")
        memories = get(MemoryController)
        self.resource(router, "memories", memories)
        self.acts(router, "memories", memories, "weigh", "remove")

    def agents(self, router: Router) -> None:
        get = self.container.get
        agents, transcripts, skills = get(AgentController), get(TranscriptController), get(SkillController)
        router.get(f"{API}/agents/live", agents.current)
        router.get(f"{API}/agents/controls/{{provider}}", agents.controls)
        self.listed(router, "agents", agents)
        router.get(f"{API}/agents/{{id}}/edits", agents.edits)
        router.get(f"{API}/agents/{{id}}/edits/text", agents.edited_text)
        router.get(f"{API}/agents/{{id}}/edits/image", agents.edited_image)
        router.get(f"{API}/agents/{{id}}/terminal", agents.terminal)
        router.get(f"{API}/agents/{{id}}/transcript", transcripts.agent_transcript)
        router.get(f"{API}/agents/{{id}}/subagents/{{session}}/transcript", transcripts.subagent_transcript)
        self.acts(router, "agents", agents, "shell", "control", "pause", "resume")
        router.post(f"{API}/agents/{{id}}/jobs/{{job}}/stop", agents.stop_job)
        router.post(f"{API}/agents/{{id}}/skip-step", agents.skip_step)
        router.post(f"{API}/agents/{{id}}/end-sequence", agents.end_sequence)
        router.get(f"{API}/skills", skills.index)
        router.get(f"{API}/skills/{{name}}", skills.show)
        router.post(f"{API}/skills/{{name}}/load", skills.load)
        router.post(f"{API}/skills/{{name}}/moment", skills.moment)
        team = get(TeamController)
        router.get(f"{API}/team", team.status)
        router.get(f"{API}/teams", team.teams)
        router.post(f"{API}/team/connect", team.connect)
        router.post(f"{API}/team/disconnect", team.disconnect)
        router.post(f"{API}/team/invite", team.invite)
        router.get(f"{API}/team/devices", team.devices)
        router.post(f"{API}/team/revoke", team.revoke)
        router.get(f"{API}/team/people", team.people)
        router.post(f"{API}/team/password", team.password)
        library = get(LibraryController)
        router.get(f"{API}/library/copies", library.copies)
        router.get(f"{API}/library/items", library.items_listed)
        router.get(f"{API}/library/items/{{item_type}}/{{name}}", library.item)
        router.post(f"{API}/library/items/{{item_type}}/{{name}}/import", library.import_item)
        router.post(f"{API}/library/items/{{item_type}}/{{name}}/update", library.update_item)
        router.post(f"{API}/library/items/{{item_type}}/publish", library.publish_item)
        profiles = get(ProfileController)
        router.get(f"{API}/profiles", profiles.index)
        router.get(f"{API}/profiles/{{name}}", profiles.one)
        router.post(f"{API}/profiles/{{name}}", profiles.save)

    def sharing(self, router: Router) -> None:
        get = self.container.get
        shares, tunnel, secrets = get(ShareController), get(TunnelController), get(SecretController)
        router.get(f"{API}/shares/opens", shares.opens)
        phones = get(PhoneController)
        router.get(f"{API}/phones", phones.index)
        router.post(f"{API}/phones/connect", phones.connect)
        router.post(f"{API}/phones/{{id}}/disconnect", phones.disconnect)
        self.listed(router, "shares", shares)
        router.post(f"{API}/shares", shares.store)
        self.acts(router, "shares", shares, "approve", "stop")
        for path, handler in (("", tunnel.show), ("/services", tunnel.services)):
            router.get(f"{API}/tunnel{path}", handler)
        for path, handler in (("/cause", tunnel.cause), ("/answering", tunnel.status), ("/version", tunnel.version), ("/domains", tunnel.domains)):
            router.get_outward(f"{API}/tunnel{path}", handler)
        for path, handler in (("/check", tunnel.check), ("/restart", tunnel.restart), ("/login", tunnel.login), ("/logout", tunnel.logout), ("/install", tunnel.install),
                              ("/update", tunnel.update), ("/release", tunnel.release), ("/readdress", tunnel.readdress)):
            router.post(f"{API}/tunnel{path}", handler)
        router.get(f"{API}/secrets/where", secrets.location)
        self.resource(router, "secrets", secrets)
        self.acts(router, "secrets", secrets, "fill", "delete", "restore", "login")
        for act, handler in (("allow-login", secrets.allow_login), ("revoke-login", secrets.revoke_login), ("forget-login", secrets.drop_login)):
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
        router.post(f"{API}/mcp/add", mcp.add)
        router.post(f"{API}/mcp/check", mcp.check)
        for act, handler in (("key", mcp.key), ("remove", mcp.remove), ("sign-in", mcp.login), ("callback", mcp.callback)):
            router.post(f"{API}/mcp/{{name}}/{act}", handler)

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
        for act in acts:
            router.post(f"{API}/{name}/{{id}}/{act}", getattr(controller, act))
