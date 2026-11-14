import json
from pathlib import Path
import shutil
import subprocess

import pytest

ROOT = Path(__file__).resolve().parents[2]
RULES = (
    "naming_plain_viewer_text",
    "naming_plain_viewer_page_text",
    "naming_plain_viewer_script_text",
    "naming_plain_setting_text",
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
<!-- @sin naming_plain_viewer_text -->
<input placeholder="Type what it needs" />
<!-- @sin naming_plain_viewer_page_text -->
<button>Enter the values</button>
<!-- @sin naming_plain_viewer_page_text -->
<span>Needs a value</span>
<!-- @righteous naming_plain_viewer_text -->
<input placeholder="Leave blank to keep the saved credential" />
<!-- @righteous naming_plain_viewer_page_text -->
<button>Add credentials</button>
</template>''')
    (samples / "labels.js").write_text('''export const labels = {
// @sin naming_plain_viewer_script_text
label: "Make it",
// @sin naming_plain_viewer_script_text
help: "Type the value",
// @righteous naming_plain_viewer_script_text
title: "Create secret",
};''')
    (samples / "settings.py").write_text('''settings = [
# @sin naming_plain_setting_text
SettingValue("saved", "Window settings", "Each window saves its own data.", TYPE),
# @righteous naming_plain_setting_text
SettingValue("saved", "Window settings", "Saved window preferences.", TYPE),
]''')
    plugin = Path(".journal/plugins/code-commandments/bin/commandments-release")
    executable = next((str(folder / plugin) for folder in (ROOT, *ROOT.parents) if (folder / plugin).is_file()), None)
    if executable is None:
        pytest.skip("the code-commandments plugin is not installed")
    completed_process = subprocess.run([executable, "rule", "prove"], cwd=tmp_path, capture_output=True, text=True, timeout=30)
    assert completed_process.returncode == 0, completed_process.stdout + completed_process.stderr
    for name in RULES:
        assert f"✓ {name}" in completed_process.stdout, completed_process.stdout
