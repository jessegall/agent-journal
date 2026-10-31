from core.base.viewer.window_declaration import WindowDeclaration

windows = [
    # @sin architecture_viewer_WindowDeclaredWithoutIconDetector
    WindowDeclaration("tasks.tasks", "Tasks", "tasks.js", "component"),
    # @righteous architecture_viewer_WindowDeclaredWithoutIconDetector
    WindowDeclaration("tasks.plans", "Plans", "plans.js", "component", icon="plan"),
]

loadings = [
    # @sin architecture_viewer_WindowLoadingPageDetector
    WindowLoading.PAGE,
    # @righteous architecture_viewer_WindowLoadingPageDetector
    WindowLoading.COMPONENT,
]

stored = dict()
# @sin architecture_viewer_WindowFieldOutsideEntryDetector
width = stored["float_width"]
# @righteous architecture_viewer_WindowFieldOutsideEntryDetector
title = stored["title"]
