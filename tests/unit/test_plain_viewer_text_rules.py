import json
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[2]
RULES = (
    "naming_PlainViewerTextDetector",
    "naming_PlainViewerPageTextDetector",
    "naming_PlainViewerScriptTextDetector",
    "naming_PlainSettingTextDetector",
)


def test_viewer_wording_rules_reject_vague_actions_and_keep_clear_actions(tmp_path):
    custom = tmp_path / ".commandments" / "custom"
    samples = custom / "samples"
    samples.mkdir(parents=True)
    (custom.parent / "config.json").write_text(json.dumps({"detectors": list(RULES)}))
    for name in (*RULES, "lists"):
        shutil.copyfile(ROOT / ".commandments" / "custom" / f"{name}.json", custom / f"{name}.json")
    shutil.copytree(ROOT / ".commandments/custom/skills/plain-viewer-text", custom / "skills/plain-viewer-text")
    (samples / "Secrets.vue").write_text('''<template>
<!-- @sin naming_PlainViewerTextDetector -->
<input placeholder="Type what it needs" />
<!-- @sin naming_PlainViewerPageTextDetector -->
<button>Enter the values</button>
<!-- @sin naming_PlainViewerPageTextDetector -->
<span>Needs a value</span>
<!-- @righteous naming_PlainViewerTextDetector -->
<input placeholder="Leave blank to keep the saved credential" />
<!-- @righteous naming_PlainViewerPageTextDetector -->
<button>Add credentials</button>
</template>''')
    (samples / "labels.js").write_text('''export const labels = {
// @sin naming_PlainViewerScriptTextDetector
label: "Make it",
// @sin naming_PlainViewerScriptTextDetector
help: "Type the value",
// @righteous naming_PlainViewerScriptTextDetector
title: "Create secret",
};''')
    (samples / "settings.py").write_text('''settings = [
# @sin naming_PlainSettingTextDetector
SettingValue("saved", "Window settings", "Each window saves its own data.", TYPE),
# @righteous naming_PlainSettingTextDetector
SettingValue("saved", "Window settings", "Saved window preferences.", TYPE),
]''')
    plugin = Path(".journal/plugins/code-commandments/bin/commandments-release")
    executable = next(str(folder / plugin) for folder in (ROOT, *ROOT.parents) if (folder / plugin).is_file())
    result = subprocess.run([executable, "rule", "prove"], cwd=tmp_path, capture_output=True, text=True, timeout=30)
    assert result.returncode == 0, result.stdout + result.stderr
    for name in RULES:
        assert f"✓ {name}" in result.stdout, result.stdout
