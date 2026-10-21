#!/usr/bin/env python3
import json
import os
import sys
import time


def answer(line: dict) -> str:
    """What echo says to one line, and the line noted in its data folder."""
    data_folder = os.environ["JOURNAL_PLUGIN_DATA"]
    with open(os.path.join(data_folder, "heard.jsonl"), "a") as heard:
        heard.write(json.dumps(line) + "\n")
    with open(os.path.join(data_folder, "environment.json"), "w") as given:
        json.dump(dict(os.environ), given)
    mode = json.load(open(os.environ["JOURNAL_SETTINGS"])).get("mode", "")
    if mode == "slow":
        time.sleep(30)
    if mode == "late":
        time.sleep(2)
    if mode == "broken":
        return "not json"
    data = line.get("data", {})
    if line["event"] == "tool_starting" and "forbidden" in json.dumps(data.get("input", {})):
        return json.dumps({"v": 1, "answer": "refuse", "reason": f"echo refuses a forbidden tool{os.environ.get('ECHO_VIA', '')}"})
    if line["event"] == "tool_finished" and "notice" in json.dumps(data.get("input", {})):
        return json.dumps({"v": 1, "answer": "tell", "tell": "echo noticed the edit"})
    if line["event"] == "idle":
        return json.dumps({"v": 1, "answer": "refuse", "reason": "echo holds the stop"})
    if line["event"] == "prompt_submitted":
        return json.dumps({"v": 1, "answer": "tell", "tell": "echo heard your prompt"})
    if line["event"] == "tasks.created":
        return json.dumps({"v": 1, "cards": [{"kind": "echoed", "key": f"task {data['id']}", "label": f"Echoed task {data['id']}"}], "commands": [f"journal task log {data['id']} \"echoed\""]})
    if line["event"] == "messages.created":
        return json.dumps({"v": 1, "commands": [f"journal message send 'heard message {data['id']}'"]})
    return ""


if __name__ == "__main__":
    print(answer(json.loads(sys.stdin.readline())))
