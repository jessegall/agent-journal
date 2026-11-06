#!/usr/bin/env python3
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

HIDDEN_FOLDER = ".rules"

line = json.loads(sys.stdin.read())
data = line["data"]
Path(os.environ["JOURNAL_PLUGIN_DATA"], "marker").write_text(line["event"])

if data["form"] == "guard":
    word = json.loads(Path(os.environ["JOURNAL_SETTINGS"]).read_text())["refused_word"]
    if word in data["row"].get("title", ""):
        print(json.dumps({"answer": "refuse", "reason": f"a task title may not hold {word}"}))
else:
    folder = data["row"]["folder"]
    tracked = subprocess.run(["git", "ls-files", HIDDEN_FOLDER], cwd=folder, capture_output=True, text=True, check=True).stdout.split("\n")
    names = [name for name in tracked if name]
    if names:
        subprocess.run(["git", "update-index", "--skip-worktree", "--", *names], cwd=folder, check=True)
        shutil.rmtree(Path(folder, HIDDEN_FOLDER), ignore_errors=True)
