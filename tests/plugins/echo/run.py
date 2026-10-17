#!/usr/bin/env python3
import json
import os
import sys
import time

line = json.loads(sys.stdin.readline())
data_folder = os.environ["JOURNAL_PLUGIN_DATA"]
with open(os.path.join(data_folder, "heard.jsonl"), "a") as heard:
    heard.write(json.dumps(line) + "\n")
with open(os.path.join(data_folder, "environment.json"), "w") as given:
    json.dump(dict(os.environ), given)
mode = json.load(open(os.environ["JOURNAL_SETTINGS"])).get("mode", "")
if mode == "slow":
    time.sleep(30)
if mode == "broken":
    print("not json")
    sys.exit(0)
data = line.get("data", {})
if line["event"] == "tool_starting" and "forbidden" in json.dumps(data.get("input", {})):
    print(json.dumps({"v": 1, "answer": "refuse", "reason": "echo refuses a forbidden tool"}))
elif line["event"] == "prompt_submitted":
    print(json.dumps({"v": 1, "answer": "tell", "tell": "echo heard your prompt"}))
elif line["event"] == "tasks.created":
    print(json.dumps({"v": 1, "cards": [{"kind": "echoed", "key": f"task {data['id']}", "label": f"Echoed task {data['id']}"}], "commands": [f"journal task log {data['id']} \"echoed\""]}))
elif line["event"] == "messages.created":
    print(json.dumps({"v": 1, "commands": [f"journal message send 'heard message {data['id']}'"]}))
else:
    print("")
