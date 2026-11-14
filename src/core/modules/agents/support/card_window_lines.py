from engine.viewer.window_tab import WindowTab

CARD_READS = ["agent limits", "setting show", "agent cards", "agent sessions", "agent list", "agent programs", "usage agents", "usage tool", "agent transcript", "message agent-reports", "hook-call feed", "output hook-page", "task show", "task list", "process-part list"]
CARD_EVENTS = ["setting.*", "agent.*", "agent_block.*", "hook_call.*", "task.*", "process_part.*", "message.*"]
CARD_TABS = [WindowTab("tasks", "Tasks", "usage agents", "tasks"), WindowTab("reports", "Reports", "message agent-reports", "reports"), WindowTab("transcript", "Transcript", "agent transcript")]
