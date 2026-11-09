from tests.stories.core.support.coding_fixtures import UserBuilder

RUN_LIMIT = "journal.suites.coding.workers.worker-run-limit"
MAX_COST = "journal.core.helpers.read-only-helper-max-cost"
SPLIT = "journal.core.helpers.program-split"
COMMAND_TYPES = "journal.suites.coding.worker-command-types"
WINDOW = "journal.core.helpers.program-window-percent"


def test_s54_ordinary_set_cannot_bypass_policy_validation(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f"setting set {RUN_LIMIT} 3 --environment main", actor=story.user)
    story.expect_refusal(f"setting set {RUN_LIMIT} 2.5 --environment main", "must be a whole number", actor=story.user)
    story.expect_refusal(f"setting set {RUN_LIMIT} -1 --environment main", "must be at least 0", actor=story.user)
    story.expect_refusal(f"setting set {RUN_LIMIT} nan --environment main", "must be a finite number", actor=story.user)
    story.expect_text(f"setting show {RUN_LIMIT} --environment main", "3", actor=story.user)


def test_s54_infinite_and_negative_costs_and_percentages_are_refused(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f"setting set {MAX_COST} 1.5 --project", actor=story.user)
    story.expect_refusal(f"setting set {MAX_COST} inf --project", "must be a finite number", actor=story.user)
    story.expect_refusal(f"setting set {MAX_COST} -2 --project", "must be at least 0", actor=story.user)
    story.expect_refusal(f"setting set {WINDOW} 101 --project", "must be at most 100", actor=story.user)
    story.expect_text(f"setting show {MAX_COST}", "1.5", actor=story.user)


def test_s54_a_list_that_breaks_its_rule_changes_nothing_and_a_repair_is_accepted(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_refusal(f"setting set {SPLIT} 'claude 60,codex 30' --project", "must add up to 100", actor=story.user)
    story.expect_refusal(f"setting set {COMMAND_TYPES} 'read,deploy' --project", "choose from", actor=story.user)
    story.expect_text(f"setting show {SPLIT}", "from: default", actor=story.user)
    story.expect_success(f"setting set {SPLIT} '[\"claude 60\", \"codex 40\"]' --project", actor=story.user)
    story.expect_text(f"setting show {SPLIT}", "codex 40", actor=story.user)
