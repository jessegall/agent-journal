# What a module says about itself at the top — examples

Bad:

```python
"""`.journal/record.json` and `.journal/runtime/<transcript>.json` — two kinds of fact.

THE RECORD IS SHARED. Pins, work, environments: what somebody decided. It belongs to the project,
survives a fresh clone, is the half worth reviewing in a diff...
"""
from __future__ import annotations
```

Also bad, even though short:

```python
"""The journal's channel: an MCP stdio server that tells an idle session the user left a message."""
from __future__ import annotations
```

Good:

```python
from __future__ import annotations

import os
import sys
from pathlib import Path

import fmt
import transcript
```
