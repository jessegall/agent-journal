from core.modules.drivers.support.contribution_slices import OLD_BLOCK_RULE, REPEATED_STOP_RELEASE, SAFETY_SLICE, ContributionSlices
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper


def test_the_old_repeated_stop_release_stands_down_only_once_every_blocked_slice_answers_the_helper(played):
    story = played(StartedHelper)
    slices = story.container.get(ContributionSlices)
    blocked = slices.blocked_slices("helper")
    assert blocked and {REPEATED_STOP_RELEASE, OLD_BLOCK_RULE} <= slices.machine_answered(blocked, "helper")
    some = frozenset(sorted(blocked)[:1]) | {SAFETY_SLICE}
    assert len(blocked) == 1 or REPEATED_STOP_RELEASE not in slices.machine_answered(some, "helper")
