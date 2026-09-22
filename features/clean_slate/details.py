from features.base import FeatureDetails


class CleanSlateDetails(FeatureDetails):
    name = "clean_slate"

    title = "Clean slate"

    abstract = """
        At launch, every hook that is not the journal's can be set aside, and is put back when
        the agent exits or the journal stops; skills are never touched
    """

    help = """
        journal claude and journal codex ask, after the environment, whether to set aside the
        other hooks. Yes keeps a copy of each hook file before taking out the hooks that are not
        the journal's; the copies are kept under .journal/runtime/set-aside. Skills stay where
        they are.

        They are put back when the agent exits, when journal stop runs, and at the next launch
        if the last one ended without putting them back. Enter repeats the last answer.
    """
