from core.base.viewer.window_declaration import WindowDeclaration

# @sin architecture_layout_TopFolderHoldsNoValuesDetector
windows = [
    # @sin architecture_viewer_WindowDeclaredWithoutIconDetector
    WindowDeclaration("tasks.tasks", "Tasks", "tasks.js", "component"),
    # @righteous architecture_viewer_WindowDeclaredWithoutIconDetector
    WindowDeclaration("tasks.plans", "Plans", "plans.js", "component", icon="plan"),
]

# @sin architecture_layout_TopFolderHoldsNoValuesDetector
loadings = [
    # @sin architecture_viewer_WindowLoadingPageDetector
    WindowLoading.PAGE,
    # @righteous architecture_viewer_WindowLoadingPageDetector
    WindowLoading.COMPONENT,
]

# @sin architecture_layout_TopFolderHoldsNoValuesDetector
stored = dict()
# @sin architecture_viewer_WindowFieldOutsideEntryDetector
# @sin architecture_layout_TopFolderHoldsNoValuesDetector
width = stored["float_width"]
# @righteous architecture_viewer_WindowFieldOutsideEntryDetector
# @sin architecture_layout_TopFolderHoldsNoValuesDetector
title = stored["title"]
