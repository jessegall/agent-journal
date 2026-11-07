from core.base.chat.dock_declaration import DockDeclaration

DOCKS = [
    # @sin architecture_viewer_dock_type_without_title
    DockDeclaration(SampleDockType.BARE, "task", "", "bare.js", most=2, reads=["task show"]),
    # @righteous architecture_viewer_dock_type_without_title
    DockDeclaration(SampleDockType.TASK, "task", "{row_title}", "task.js", most=2, reads=["task show"]),
]

WINDOWS = [
    # @sin architecture_viewer_panel_outside_web_folder
    # @sin architecture_viewer_window_declared_without_icon
    WindowDeclaration("dockish.cards", "Cards", "../../viewer/web/cards.js", WindowLoading.COMPONENT),
    # @righteous architecture_viewer_panel_outside_web_folder
    # @sin architecture_viewer_window_declared_without_icon
    WindowDeclaration("dockish.cards", "Cards", "cards.js", WindowLoading.COMPONENT),
]
