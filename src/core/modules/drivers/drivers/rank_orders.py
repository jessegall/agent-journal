"""The rank orders of the drivers of the new machine (doc 1310 section 5.1), highest first: one table, so the drivers of
every agent type rank the keys their modules share the same way. Each phase-2 port adds the keys of its module."""

from engine.agent_machine.needs.rank_order import RankOrder

POLICY_RANKS = ("safety.all", "access.all", "shell.all", "drivers.policies", "messages.policies", "skills.policies", "sequences.policies",
                "helpers.policies", "questions.policies", "plugins.policies", "triggers.policies", "tools.policies", "workers.test-lines", "workers.policies")
INSTRUCTION_RANKS = ("skills.command", "skills.read-first", "triggers.skill", "messages.unread", "documents.open", "memories.mark")
TASK_START_RANKS = ("workers.status-first", "workers.no-task", "sequences.untaken-step", "processes.reader-request", "processes.silent-run")
FILE_CHANGE_RANKS = ("tasks.unlogged-writes", "processes.output-title")
STOP_RANKS = ("workers.delivered-proofs", "reminders.due")
MAIN_RANK_ORDER = RankOrder(POLICY_RANKS, ("overview.first", *INSTRUCTION_RANKS, "plans.context", *TASK_START_RANKS, "messages.unanswered", *FILE_CHANGE_RANKS,
                                           "tasks.blocked-review", *STOP_RANKS))
HELPER_RANK_ORDER = RankOrder(POLICY_RANKS, (*INSTRUCTION_RANKS, *TASK_START_RANKS, "messages.unanswered", *FILE_CHANGE_RANKS, *STOP_RANKS))
WORKER_RANK_ORDER = RankOrder(POLICY_RANKS, (*INSTRUCTION_RANKS, *TASK_START_RANKS, "messages.unanswered", *FILE_CHANGE_RANKS, *STOP_RANKS))
