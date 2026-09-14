# Naming an unpacked outcome — examples

Bad:

```python
took, msg = pins.add(r, "every environment obeys this", AT, 300, key=pins.RULES)
```

Good:

```python
ok, msg = pins.add(r, "every environment obeys this", AT, 300, key=pins.RULES)
```
