from core.base.chat.dock_declaration import DockDeclaration

DOCKS = [
    # @sin architecture_viewer_DockCardHasTitleDetector
    DockDeclaration(SampleDockType.BARE, "task", "", "bare.js", most=2, reads=["task show"]),
    # @righteous architecture_viewer_DockCardHasTitleDetector
    DockDeclaration(SampleDockType.TASK, "task", "{row_title}", "task.js", most=2, reads=["task show"]),
]

WINDOWS = [
    # @sin architecture_viewer_PanelFromWebFolderDetector
    # @sin architecture_viewer_WindowDeclaredWithoutIconDetector
    WindowDeclaration("dockish.cards", "Cards", "../../viewer/web/cards.js", WindowLoading.COMPONENT),
    # @righteous architecture_viewer_PanelFromWebFolderDetector
    # @sin architecture_viewer_WindowDeclaredWithoutIconDetector
    WindowDeclaration("dockish.cards", "Cards", "cards.js", WindowLoading.COMPONENT),
]
