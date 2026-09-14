# A module's say() helper — examples

Bad:

```python
def say(key: str, **values) -> str:
    return render(MESSAGES[key], **values)
```

Good:

```python
def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)
```
