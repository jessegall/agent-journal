# Where imports go — examples

Bad, with no cycle or hook cost to justify it:

```python
def doc_where(doc_ref: str) -> dict | None:
    out = where()
    if doc_ref:
        import docs
        got, err = docs.normalize_ref(root(), doc_ref)
```

Good:

```python
from pathlib import Path

import docs
import state


def doc_where(doc_ref: str) -> dict | None:
    out = where()
    if doc_ref:
        got, err = docs.normalize_ref(root(), doc_ref)
```
