"""The rank orders of core's drivers (doc 1310 section 5.1), highest first: one table, so the drivers of every agent
type rank the keys their modules share the same way; a suite's drivers build theirs from these parts."""

from engine.agent_machine.states.rank_order import RankOrder

POLICY_RANKS = ("safety.all", "access.all", "shell.all", "drivers.policies", "messages.policies", "skills.policies", "sequences.policies",
                "helpers.policies", "questions.policies", "plugins.policies", "triggers.policies", "tools.policies")
INSTRUCTION_RANKS = ("skills.command", "skills.read-first", "triggers.skill", "messages.unread", "documents.open", "memories.mark")
TASK_START_RANKS = ("sequences.untaken-step", "processes.reader-request", "processes.silent-run")
FILE_CHANGE_RANKS = ("tasks.unlogged-writes", "processes.output-title")
STOP_RANKS = ("reminders.due",)




class RankOrders:
    """The rank order of a main agent and of a helper, built from the policy, task start and stop keys a set of
    modules gives."""

    @staticmethod
    def main(policies: tuple[str, ...], task_starts: tuple[str, ...], stops: tuple[str, ...]) -> RankOrder:
        return RankOrder(policies, ("overview.first", *INSTRUCTION_RANKS, "plans.context", *task_starts, "messages.unanswered", *FILE_CHANGE_RANKS,
                                    "tasks.blocked-review", *stops))

    @staticmethod
    def helper(policies: tuple[str, ...], task_starts: tuple[str, ...], stops: tuple[str, ...]) -> RankOrder:
        return RankOrder(policies, (*INSTRUCTION_RANKS, *task_starts, "messages.unanswered", *FILE_CHANGE_RANKS, *stops))


MAIN_RANK_ORDER = RankOrders.main(POLICY_RANKS, TASK_START_RANKS, STOP_RANKS)
HELPER_RANK_ORDER = RankOrders.helper(POLICY_RANKS, TASK_START_RANKS, STOP_RANKS)
