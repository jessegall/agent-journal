from engine.agent_machine.capabilities import Capabilities
from engine.agent_machine.compiling.contribution_declaration import ContributionDeclaration
from engine.agent_machine.compiling.declared_module import DeclaredModule
from engine.agent_machine.compiling.driver_declaration import DriverDeclaration
from engine.agent_machine.compiling.program_declaration import ProgramDeclaration
from engine.agent_machine.contracts.capability import Capability
from engine.agent_machine.contracts.rank_order import RankOrder
from engine.enums.capability_fallback import CapabilityFallback
from engine.enums.capability_part import CapabilityPart
from engine.enums.capability_proof import CapabilityProof
from engine.enums.contribution_kind import ContributionKind
from engine.enums.hold_end import HoldEnd
from engine.enums.hook_event_name import HookEventName
from engine.enums.line_carrier import LineCarrier
from engine.enums.responder import Responder
from engine.enums.transform_slot import TransformSlot
from engine.enums.work_stop import WorkStop

AGENT_TYPES = ("main", "helper", "worker", "merger")
EVERY_TYPE = ()
MAIN, WORKER, HELPERS = ("main",), ("worker",), ("helper", "merger")
NOT_MAIN = ("helper", "worker", "merger")
SAFETY, ACCESS, SHELL = "safety.all", "access.all", "shell.all"
WAIVABLE = (HoldEnd.SATISFIED, HoldEnd.WAIVED)

# Doc 1310 revision 2, section 4.6: every hold, by its rank key, the agent types it applies to, the ends it may take
# and the command lines that satisfy it.
HOLDS = {
    "drivers": [],
    "overview": [("overview.first", MAIN, WAIVABLE, ("journal overview",))],
    "skills": [("skills.command", EVERY_TYPE, (*WAIVABLE, HoldEnd.TARGET_MISSING), ("journal skill read",)),
               ("skills.read-first", EVERY_TYPE, (*WAIVABLE, HoldEnd.TARGET_MISSING), ("journal skill read",))],
    "triggers": [("triggers.skill", EVERY_TYPE, (*WAIVABLE, HoldEnd.TARGET_MISSING), ("journal skill read",))],
    "messages": [("messages.unread", EVERY_TYPE, (*WAIVABLE, HoldEnd.TARGET_MISSING), ("journal message read", "journal message unread")),
                 ("messages.unanswered", EVERY_TYPE, (*WAIVABLE, HoldEnd.TARGET_MISSING), ("journal message reply",)),
                 ("messages.tag-pictures", EVERY_TYPE, (*WAIVABLE, HoldEnd.TARGET_MISSING), ("journal message tag",))],
    "documents": [("documents.open", EVERY_TYPE, (*WAIVABLE, HoldEnd.CANCELLED), ("journal doc close",))],
    "memories": [("memories.mark", EVERY_TYPE, WAIVABLE, ("journal memory weigh", "journal memory skip"))],
    "plans": [("plans.context", EVERY_TYPE, (*WAIVABLE, HoldEnd.CANCELLED), ("journal plan context",))],
    "tasks": [("tasks.brief", EVERY_TYPE, (*WAIVABLE, HoldEnd.CANCELLED), ("journal task overview",)),
              ("tasks.unlogged-writes", EVERY_TYPE, WAIVABLE, ("journal task log",)),
              ("tasks.blocked-review", EVERY_TYPE, WAIVABLE, ("journal task block", "journal task unblock"))],
    "sequences": [("sequences.untaken-step", EVERY_TYPE, (*WAIVABLE, HoldEnd.CANCELLED), ("journal sequence follow",))],
    "processes": [("processes.reader-request", EVERY_TYPE, (*WAIVABLE, HoldEnd.EXPIRED), ("journal reader add",)),
                  ("processes.reader-help", MAIN, WAIVABLE, ("journal reader add",)),
                  ("processes.silent-run", EVERY_TYPE, (*WAIVABLE, HoldEnd.TARGET_MISSING), ("journal output read",)),
                  ("processes.output-title", EVERY_TYPE, (*WAIVABLE, HoldEnd.TARGET_MISSING), ("journal output title",)),
                  ("processes.background-watch", EVERY_TYPE, (*WAIVABLE, HoldEnd.TARGET_MISSING), ("journal output read",))],
    "reminders": [("reminders.due", EVERY_TYPE, (*WAIVABLE, HoldEnd.EXPIRED, HoldEnd.CANCELLED), ("journal reminder done",))],
    "plugins": [("plugins.request", EVERY_TYPE, (*WAIVABLE, HoldEnd.TARGET_MISSING), ("journal plugin answer",))],
    "workers": [("workers.status-first", WORKER, WAIVABLE, ("journal worker status",)),
                ("workers.no-task", WORKER, WAIVABLE, ("journal task start",)),
                ("workers.failed-tests", WORKER, (*WAIVABLE, HoldEnd.CANCELLED), ("journal worker commit",)),
                ("workers.update", WORKER, WAIVABLE, ("journal worker update",)),
                ("workers.unmerged", MAIN, (*WAIVABLE, HoldEnd.TARGET_MISSING), ("journal worker merge",)),
                ("workers.delivered-proofs", MAIN, WAIVABLE, ("journal proof check",))],
}

# Doc 1310 revision 2, section 4.4: what makes an agent work and what makes it wait, by the module that declares it.
WORK = {
    "tasks": [("tasks.task", MAIN)], "sequences": [("sequences.sequence", EVERY_TYPE)], "helpers": [("helpers.job", ("helper",))],
    "workers": [("workers.unit", WORKER), ("workers.merge-job", ("merger",))], "coding": [("coding.handed-task", MAIN), ("coding.own-tasks", MAIN)],
}
WAITS = {
    "waits": [("waits.wait", EVERY_TYPE)], "questions": [("questions.question", EVERY_TYPE)],
    "processes": [("processes.run", EVERY_TYPE), ("processes.reader-request-wait", EVERY_TYPE)], "helpers": [("helpers.helper-running", EVERY_TYPE)],
    "workers": [("workers.tests", WORKER), ("workers.answer", WORKER), ("workers.blocked-task", WORKER), ("workers.merge", WORKER)],
}

# Doc 1310 revision 2, sections 10.1 to 10.5: the policies by their rule keys and rank groups, and the safety ones.
POLICIES = {
    "drivers": [("drivers.access", ACCESS, HELPERS), ("drivers.database-file", SAFETY, EVERY_TYPE), ("drivers.panic-file", SAFETY, EVERY_TYPE),
                ("drivers.private-corpus", SAFETY, EVERY_TYPE), ("drivers.managed-hooks", "drivers.policies", EVERY_TYPE),
                ("drivers.helper-type-commands", ACCESS, NOT_MAIN), ("drivers.native-subagent", "drivers.policies", EVERY_TYPE),
                ("drivers.no-full-test-run", SHELL, EVERY_TYPE), ("drivers.no-git", SHELL, EVERY_TYPE), ("context.hard-limit", "drivers.policies", EVERY_TYPE)],
    "messages": [("messages.unread-show", "messages.policies", EVERY_TYPE)],
    "skills": [("skills.already-loaded", "skills.policies", EVERY_TYPE)],
    "processes": [(f"processes.{key}", SHELL, EVERY_TYPE) for key in ("reading", "sleep-poll-refusal", "retry-loop", "journal-chain", "journal-pipe",
                                                                       "read-command-output", "folder-change", "hand-made-monitor", "runner-line",
                                                                       "failed-full-run", "worker-test-limit-refusal")],
    "helpers": [("helpers.start-names-model", "helpers.policies", EVERY_TYPE)],
    "questions": [("questions.own-tool", "questions.policies", EVERY_TYPE)],
    "aliases": [("aliases.saved-command", SHELL, EVERY_TYPE), ("aliases.unknown-command", SHELL, EVERY_TYPE), ("aliases.expansion-refusal", SHELL, EVERY_TYPE)],
    "agents": [("agents.program-settings", SAFETY, EVERY_TYPE)],
    "claude_code": [("claude_code.native-memory", SAFETY, EVERY_TYPE)],
    "secrets": [("secrets.secrets-folder", SAFETY, EVERY_TYPE)],
    "plugins": [("plugins.plugin-program", "plugins.policies", EVERY_TYPE), ("plugins.plugin-guard", "plugins.policies", EVERY_TYPE)],
    "sequences": [("sequences.step-guard", "sequences.policies", EVERY_TYPE), ("sequences.step-refused-command", "sequences.policies", EVERY_TYPE)],
    "triggers": [("triggers.phrase", "triggers.policies", EVERY_TYPE)],
    "tools": [("tools.graphify-search", "tools.policies", EVERY_TYPE)],
    "coding": [("coding.main-writes-no-code", ACCESS, MAIN)],
    "workers": [(f"workers.{key}", ACCESS if key.startswith("worker-") or key in ("protected-folder", "outside-link") else "workers.policies", EVERY_TYPE)
                for key in ("no-full-test-run", "no-git", "dispatch-allowed", "helper-allowed", "dispatch-names-model", "worker-reuse", "worker-file",
                            "protected-folder", "worker-read", "outside-link", "named-tests-only", "proved-delivery", "phase-tests")],
}
SAFETY_MODULES = ("drivers", "agents", "claude_code", "secrets")
SUITE_MODULES = ("coding", "workers", "tools", "checks")

LINES = {
    "drivers": ["continued-session", "opening-lines", "takeover", "long-output", "repeated-file-read", "managed-hooks-lines"],
    "messages": ["delivery", "unanswered-line", "read-marks-read", "agent-text-hints", "chat-manners", "chat-opening", "plain-code", "reply-note"],
    "tasks": ["blocked-work-at-stop", "quiet-task", "log-request", "start-with-one-in-hand", "filed", "named-task", "still-held", "where-you-stand",
              "session-start-summary", "wait-in-words", "unopenable-blocks"],
    "plans": ["focus", "task-order", "state-lines", "task-end-lines"],
    "overview": ["overview-first-line"], "memories": ["open-mark-line", "start-delivery", "keyword-delivery"],
    "processes": ["orphan-process", "ended-output-line", "status-monitor", "read-advice", "run-titles", "alias-suggestion", "run-queue-halted", "watch-lines"],
    "dumps": ["open-dump"], "waits": ["long-wait"], "project_rules": ["start-rules"], "pins": ["link-pin", "agent-text-pin"],
    "plugins": ["plugin-events-line"], "reminders": ["due-line"], "triggers": ["phrase-line", "scheduled"], "sequences": ["triggers-line"],
    "coding": ["waiting-items", "introduction"], "checks": ["broken-task-wait", "failed"], "tools": ["graphify-search-line"],
    "workers": ["worker-log-due", "merge-waits-for-checkout", "stopped-worker", "unstarted-worker", "small-batch", "workers-out-at-start",
                "context-limit-stop-now", "unmerged-worker-line", "inactive-helper"],
}
WAITING_LINES = ("messages.agent-text-hints", "tasks.blocked-work-at-stop")
STEP_LINES = ("processes.orphan-process",)

# The effects: key, whether it is required (its failure line declared), and whether it runs after the commit.
EFFECTS = {
    "drivers": [("drivers.use-permission", True), ("drivers.record-agent-notice", False), ("drivers.safeguards-stop", False),
                ("drivers.spend-grant", True), ("drivers.request-compaction", True)],
    "messages": [("messages.record-delivery", False), ("messages.note-read", False), ("messages.agent-text", False), ("messages.text-before-tool", False),
                 ("messages.transcript-catch-up", False), ("messages.typed-prompt", False), ("messages.peer", False)],
    "tasks": [("tasks.reminder-record", False)], "skills": [("skills.record-kept", False)],
    "memories": [("memories.open-mark", False), ("memories.give-memories", False)],
    "processes": [("processes.start-process", True), ("processes.leftover-runs", False), ("processes.add-dock-item", False), ("processes.watch", False)],
    "helpers": [("helpers.hand-in", True)], "waits": [("waits.end-wait", False)],
    "schedules": [("schedules.scheduled-job", False), ("schedules.scheduled-job-run", False)],
    "pins": [("pins.automatic-link", False), ("pins.link-pin", False), ("pins.agent-text-pin", False)],
    "plugins": [("plugins.delivery", False)], "reminders": [("reminders.due", False)],
    "triggers": [("triggers.fire", False), ("triggers.scheduled", False)], "sequences": [("sequences.move-run", False)],
    "checks": [("checks.failed", False)], "coding": [("coding.assign-next-task", False)],
    "workers": [("workers.record-test-run", False), ("workers.report", False), ("workers.inactive-helper", False), ("workers.record-todo-list", False)],
}
AFTER_COMMIT_EFFECTS = ("plugins.delivery",)
TRANSFORMS = {"aliases": [("aliases.expansion", TransformSlot.ALIAS)], "drivers": [("drivers.managed-hooks-rewrite", TransformSlot.PROJECT_HOOK)],
              "processes": [("processes.runner-wrap", TransformSlot.RUNNER)]}
WAKE_CAUSES = {"drivers": ["drivers.turn-failed"], "coding": ["coding.cache-refresh"], "helpers": ["helpers.launch-failed"]}
AGENT_LISTENERS = {"messages": ["messages.recipient"], "helpers": ["helpers.launch-failure"], "drivers": ["drivers.missing-process"]}
SUBJECTS = {"messages": ["message"], "tasks": ["task"], "processes": ["process", "reader_request"], "helpers": ["helper_job"],
            "questions": ["question"], "waits": ["wait"], "documents": ["document"], "sequences": ["sequence_run"], "workers": ["worktree", "proof"]}

MAIN_HOLD_ORDER = ("overview.first", "skills.command", "skills.read-first", "triggers.skill", "messages.unread", "documents.open", "memories.mark",
                   "plans.context", "tasks.brief", "sequences.untaken-step", "processes.reader-request", "processes.reader-help", "processes.silent-run",
                   "messages.unanswered", "tasks.unlogged-writes", "messages.tag-pictures", "processes.output-title", "plugins.request",
                   "tasks.blocked-review", "reminders.due", "workers.unmerged", "processes.background-watch", "workers.delivered-proofs")
WORKER_HOLD_ORDER = ("workers.status-first", "workers.no-task", "tasks.brief", "skills.command", "skills.read-first", "triggers.skill", "messages.unread",
                     "documents.open", "memories.mark", "workers.update", "workers.failed-tests", "plans.context", "sequences.untaken-step",
                     "processes.reader-request", "processes.silent-run", "messages.unanswered", "tasks.unlogged-writes", "messages.tag-pictures",
                     "processes.output-title", "plugins.request", "tasks.blocked-review", "reminders.due", "processes.background-watch")
HELPER_HOLD_ORDER = tuple(rank for rank in WORKER_HOLD_ORDER if not rank.startswith("workers."))
MODULE_POLICY_ORDER = tuple(f"{module}.policies" for module in ("drivers", "messages", "skills", "helpers", "questions", "plugins", "sequences",
                                                                "triggers", "tools", "workers"))
POLICY_ORDER = (SAFETY, ACCESS, SHELL, *MODULE_POLICY_ORDER)


class DesignDeclarations:
    """Every contribution and driver doc 1310 revision 2 asks for (sections 4.4, 4.6, 5.1 and 10), as the inert manifest
    phase 0 compiles through sync's checks before any module declares a class; the keys are the census's rule keys."""

    @staticmethod
    def modules() -> list[DeclaredModule]:
        names = sorted({*HOLDS, *WORK, *WAITS, *POLICIES, *LINES, *EFFECTS, *TRANSFORMS, *WAKE_CAUSES, *AGENT_LISTENERS, *SUBJECTS})
        return [DeclaredModule(name, name not in SUITE_MODULES, (), tuple(DesignDeclarations.contributions(name))) for name in names]

    @staticmethod
    def contributions(module: str) -> list[ContributionDeclaration]:
        holds = [declaration for rank, agent_types, ends, lifting in HOLDS.get(module, []) for declaration in (
            ContributionDeclaration(f"{rank}-needs", ContributionKind.NEED, rank, agent_types, "Blocked"),
            ContributionDeclaration(f"{rank}-condition", ContributionKind.BLOCK_CONDITION, ends=ends, lifting_lines=lifting))]
        work = [ContributionDeclaration(key, ContributionKind.NEED, "", agent_types, "Working") for key, agent_types in WORK.get(module, [])]
        waits = [ContributionDeclaration(key, ContributionKind.NEED, "", agent_types, "Waiting") for key, agent_types in WAITS.get(module, [])]
        policies = [ContributionDeclaration(key, ContributionKind.POLICY, rank, agent_types, is_safety=rank == SAFETY) for key, rank, agent_types in POLICIES.get(module, [])]
        lines = [ContributionDeclaration(key, ContributionKind.LINE, events=(HookEventName.TICK,) if key in STEP_LINES else (HookEventName.PRE_TOOL_USE,),
                                         carrier=LineCarrier.WAITING if key in WAITING_LINES else LineCarrier.NOW)
                 for key in (f"{module}.{name}" for name in LINES.get(module, []))]
        effects = [ContributionDeclaration(key, ContributionKind.EFFECT, is_required=required, has_failure=required) for key, required in EFFECTS.get(module, [])]
        transforms = [ContributionDeclaration(key, ContributionKind.TRANSFORM, slot=slot) for key, slot in TRANSFORMS.get(module, [])]
        wakes = [ContributionDeclaration(key, ContributionKind.WAKE_CAUSE) for key in WAKE_CAUSES.get(module, [])]
        listeners = [ContributionDeclaration(key, ContributionKind.AGENT_LISTENER) for key in AGENT_LISTENERS.get(module, [])]
        subjects = [ContributionDeclaration(key, ContributionKind.SUBJECT) for key in SUBJECTS.get(module, [])]
        compaction = [ContributionDeclaration("drivers.compaction-due", ContributionKind.NEED, "", EVERY_TYPE, "Compacting")] if module == "drivers" else []
        return [*holds, *work, *waits, *compaction, *policies, *lines, *effects, *transforms, *wakes, *listeners, *subjects]

    @staticmethod
    def drivers() -> list[DriverDeclaration]:
        main_order = RankOrder(POLICY_ORDER, MAIN_HOLD_ORDER)
        return [DriverDeclaration("core.main", "main", "core", (), main_order, WorkStop.REFUSE_WHILE_WORK_REMAINS, Responder.PERSON),
                DriverDeclaration("core.helper", "helper", "core", (), RankOrder(POLICY_ORDER, HELPER_HOLD_ORDER), WorkStop.HAND_IN, Responder.PARENT),
                DriverDeclaration("coding.main", "main", "coding", ("core.main",), main_order, WorkStop.REFUSE_WHILE_WORK_REMAINS, Responder.PERSON),
                DriverDeclaration("coding.worker", "worker", "coding", (), RankOrder(POLICY_ORDER, WORKER_HOLD_ORDER), WorkStop.REFUSE_WHILE_WORK_REMAINS, Responder.PARENT),
                DriverDeclaration("coding.merger", "merger", "coding", (), RankOrder(POLICY_ORDER, HELPER_HOLD_ORDER), WorkStop.MERGE_CONTRACT, Responder.PARENT)]

    @staticmethod
    def programs() -> list[ProgramDeclaration]:
        claude = Capabilities(Capability(CapabilityPart.TOOL_DENIAL, HookEventName.PRE_TOOL_USE, CapabilityProof.IMPLEMENTED_HERE),
                              Capability(CapabilityPart.STOP_REFUSAL, HookEventName.STOP, CapabilityProof.IMPLEMENTED_HERE),
                              Capability(CapabilityPart.REWRITE, HookEventName.PRE_TOOL_USE, CapabilityProof.IMPLEMENTED_HERE),
                              Capability(CapabilityPart.LINES, HookEventName.PRE_TOOL_USE, CapabilityProof.IMPLEMENTED_HERE),
                              Capability(CapabilityPart.LINES, HookEventName.TICK, CapabilityProof.IMPLEMENTED_HERE),
                              Capability(CapabilityPart.WAKE_HOOK, HookEventName.STOP, CapabilityProof.DOCUMENTED_UPSTREAM, CapabilityFallback.TYPING_OR_RESUME))
        codex = Capabilities(Capability(CapabilityPart.TOOL_DENIAL, HookEventName.PRE_TOOL_USE, CapabilityProof.IMPLEMENTED_HERE),
                             Capability(CapabilityPart.STOP_REFUSAL, HookEventName.STOP, CapabilityProof.IMPLEMENTED_HERE),
                             Capability(CapabilityPart.REWRITE, HookEventName.PRE_TOOL_USE, CapabilityProof.IMPLEMENTED_HERE, CapabilityFallback.PROCESS_RUN_REFUSAL),
                             Capability(CapabilityPart.LINES, HookEventName.PRE_TOOL_USE, CapabilityProof.IMPLEMENTED_HERE),
                             Capability(CapabilityPart.WAKE_HOOK, HookEventName.STOP, CapabilityProof.DOCUMENTED_UPSTREAM, CapabilityFallback.TYPING_OR_RESUME))
        return [ProgramDeclaration("claude", claude), ProgramDeclaration("codex", codex)]
