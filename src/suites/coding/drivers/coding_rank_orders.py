"""The rank orders of the coding suite's drivers: core's, with the workers module's keys in their places."""

from core.modules.drivers.drivers.rank_orders import POLICY_RANKS, STOP_RANKS, TASK_START_RANKS, RankOrders

CODING_POLICY_RANKS = (*POLICY_RANKS, "workers.test-lines", "workers.policies")
CODING_TASK_START_RANKS = ("workers.status-first", "workers.no-task", *TASK_START_RANKS)
CODING_STOP_RANKS = ("workers.delivered-proofs", *STOP_RANKS)
CODING_MAIN_RANK_ORDER = RankOrders.main(CODING_POLICY_RANKS, CODING_TASK_START_RANKS, CODING_STOP_RANKS)
CODING_HELPER_RANK_ORDER = RankOrders.helper(CODING_POLICY_RANKS, CODING_TASK_START_RANKS, CODING_STOP_RANKS)
