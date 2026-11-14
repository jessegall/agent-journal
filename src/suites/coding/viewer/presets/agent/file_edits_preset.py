from engine.viewer.layout_shape import split, tabs
from engine.viewer.viewer_preset import ViewerPreset
from suites.coding.viewer.presets.agent.agent_work_tabs import AGENT_WORK_TABS


class FileEditsPreset(ViewerPreset):
    """An agent's file feed first among its work, next to its chat and transcript."""

    key = "file-edits"
    name = "File edits"
    text = "What it changed, next to what it says"
    shape = split("row", 0.5, tabs("coding.file-feed", *(name for name in AGENT_WORK_TABS if name != "coding.file-feed")), tabs("messages.chat", "agents.transcript"))
