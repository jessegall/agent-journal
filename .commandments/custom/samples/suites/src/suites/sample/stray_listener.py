from core.base.listener.commit_listener import CommitListener


# @sin architecture_layout_TopFolderHoldsModuleAndSuiteDetector
# @sin architecture_layout_ListenersInListenersFoldersDetector
class StrayListener(CommitListener):
    name = "sample.stray-listener"
