from features.base import FeatureDetails
from features.groups import Group


class CleanSlateDetails(FeatureDetails):
    explains = 'The journal can keep other agent hooks from interrupting its turn. You can choose whether this protection is on.'
    name = "clean_slate"
    group = Group.PROJECT
    label = "Turn off other hooks while the agent runs"
    hint = "They are turned back on when the agent exits. Skills are not touched."
    has_skill = False

    title = "Turn off other hooks"


    abstract = """
        Turns off every hook that is not the journal's while the agent runs. They are turned back on
        when the agent exits or the journal stops. Skills are not touched.
    """

    help = """
        journal claude and journal codex ask, after the environment, whether to set aside the
        other hooks. Yes keeps a copy of each hook file before taking out the hooks that are not
        the journal's; the copies are kept under .journal/runtime/set-aside. Skills stay where
        they are.

        They are put back when the agent exits, when journal stop runs, and at the next launch
        if the last one ended without putting them back. Enter repeats the last answer.
    """
