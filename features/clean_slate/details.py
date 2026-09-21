from features.base import FeatureDetails


class CleanSlateDetails(FeatureDetails):
    name = "clean_slate"

    title = "Clean slate"

    abstract = """
        At launch, every skill and hook that is not the journal's can be set aside, and is put
        back when the agent exits or the journal stops
    """

    help = """
        journal claude and journal codex ask, after the environment, whether to set aside the
        other skills and hooks. Yes moves every skill that is not a journal skill out of the
        agent's skill folders, in the project and in your home folder, and keeps a copy of each
        hook file before taking out the hooks that are not the journal's. Everything is kept
        under .journal/runtime/set-aside.

        They are put back when the agent exits, when journal stop runs, and at the next launch
        if the last one ended without putting them back. Enter repeats the last answer.
    """
