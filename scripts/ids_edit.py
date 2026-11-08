from pathlib import Path

tests = Path(__file__).resolve().parents[1] / "src" / "viewer" / "tests"
for name, old, new in [
    ("messageFold.test.js", 'const base = {id: 4, type', 'let next = 100;\nconst base = {type'),
    ("messageFold.test.js", 'mounted(MessageCard, context({}), {message: {...base, ...message}})', 'mounted(MessageCard, context({}), {message: {...base, id: next++, ...message}})'),
    ("messageWorkerReport.test.js", 'const element = await mounted(MessageCard, context({}), {message});\n    await new Promise', 'const element = await mounted(MessageCard, context({}), {message: {...message, id: next++}});\n    await new Promise'),
    ("messageWorkerReport.test.js", 'const LONG =', 'let next = 100;\nconst LONG ='),
]:
    file = tests / name
    text = file.read_text()
    assert old in text, (name, old)
    file.write_text(text.replace(old, new, 1))
print("done", flush=True)
