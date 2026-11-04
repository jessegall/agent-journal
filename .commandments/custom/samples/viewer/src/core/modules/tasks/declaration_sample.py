from core.base.viewer.window_declaration import WindowDeclaration

# @sin architecture_layout_value_at_a_module_top
windows = [
    # @sin architecture_viewer_window_declared_without_icon
    WindowDeclaration("tasks.tasks", "Tasks", "tasks.js", "component"),
    # @righteous architecture_viewer_window_declared_without_icon
    WindowDeclaration("tasks.plans", "Plans", "plans.js", "component", icon="plan"),
]

# @sin architecture_layout_value_at_a_module_top
loadings = [
    # @sin architecture_viewer_window_loading_page
    WindowLoading.PAGE,
    # @righteous architecture_viewer_window_loading_page
    WindowLoading.COMPONENT,
]

# @sin architecture_layout_value_at_a_module_top
stored = dict()
# @sin architecture_viewer_window_field_outside_entry
# @sin architecture_layout_value_at_a_module_top
width = stored["float_width"]
# @righteous architecture_viewer_window_field_outside_entry
# @sin architecture_layout_value_at_a_module_top
title = stored["title"]
