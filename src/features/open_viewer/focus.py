import json
import subprocess
import sys

BROWSERS = (
    ("com.google.Chrome", "chromium"),
    ("com.google.Chrome.canary", "chromium"),
    ("org.chromium.Chromium", "chromium"),
    ("com.brave.Browser", "chromium"),
    ("com.microsoft.edgemac", "chromium"),
    ("com.vivaldi.Vivaldi", "chromium"),
    ("com.apple.Safari", "safari"),
)

SCRIPT = f"""
function run(argv) {{
    const target = argv[0]
    const browsers = {json.dumps(BROWSERS)}
    for (const [id, kind] of browsers) {{
        try {{
            const app = Application(id)
            if (!app.running()) continue
            const windows = app.windows()
            for (let wi = 0; wi < windows.length; wi++) {{
                const tabs = windows[wi].tabs()
                for (let ti = 0; ti < tabs.length; ti++) {{
                    if (!String(tabs[ti].url() || "").startsWith(target)) continue
                    if (kind === "safari") windows[wi].currentTab = tabs[ti]
                    else windows[wi].activeTabIndex = ti + 1
                    windows[wi].index = 1
                    app.activate()
                    return "focused"
                }}
            }}
        }} catch (_) {{}}
    }}
    throw new Error("viewer tab not found")
}}
"""


def existing_tab(url: str, platform: str = sys.platform, runner=subprocess.run) -> bool:
    if platform != "darwin":
        return False
    try:
        result = runner(["osascript", "-l", "JavaScript", "-e", SCRIPT, "--", url], capture_output=True, timeout=2)
        return result.returncode == 0
    except (OSError, subprocess.TimeoutExpired):
        return False
