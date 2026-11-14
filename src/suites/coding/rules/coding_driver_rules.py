from suites.coding.rules.failed_full_run_rule import FailedFullRunRule
from suites.coding.rules.graphify_search_rule import GraphifySearchRule
from suites.coding.rules.introduction_rule import IntroductionRule
from suites.coding.rules.waiting_items_rule import WaitingItemsRule

CODING_DRIVER_RULES = [WaitingItemsRule, IntroductionRule, FailedFullRunRule, GraphifySearchRule]
