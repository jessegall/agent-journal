"""The rank orders of the drivers of the new machine (doc 1310 section 5.1), highest first: one table, so the drivers of
every agent type rank the keys their modules share the same way. Each phase-2 port adds the keys of its module."""

from engine.agent_machine.contracts.rank_order import RankOrder

POLICY_RANKS = ("safety.all", "access.all", "shell.all", "drivers.policies", "messages.policies", "skills.policies", "sequences.policies",
                "helpers.policies", "questions.policies", "plugins.policies", "triggers.policies")
SHARED_BLOCK_RANKS = ("skills.command", "skills.read-first", "triggers.skill", "messages.unread", "documents.open", "memories.mark",
                      "sequences.untaken-step", "processes.reader-request", "processes.silent-run", "tasks.unlogged-writes", "processes.output-title",
                      "reminders.due")
MAIN_RANK_ORDER = RankOrder(POLICY_RANKS, ("overview.first", *SHARED_BLOCK_RANKS[:6], "plans.context", *SHARED_BLOCK_RANKS[6:9], "messages.unanswered",
                                           *SHARED_BLOCK_RANKS[9:11], "tasks.blocked-review", *SHARED_BLOCK_RANKS[11:]))
HELPER_RANK_ORDER = RankOrder(POLICY_RANKS, (*SHARED_BLOCK_RANKS, "messages.unanswered"))
WORKER_RANK_ORDER = RankOrder(POLICY_RANKS, SHARED_BLOCK_RANKS)
