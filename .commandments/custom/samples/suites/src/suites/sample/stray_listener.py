from core.base.listener.commit_listener import CommitListener


# @sin architecture_suites_TopFolderHoldsModuleAndSuiteDetector
# @sin architecture_suites_ListenersInListenersFoldersDetector
class StrayListener(CommitListener):
    name = "sample.stray-listener"
