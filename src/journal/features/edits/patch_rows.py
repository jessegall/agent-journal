class PatchRows:
    """The changed lines of a tool's edit, numbered, from the provider's structured patch; a whole write, or an edit with no patch, is its new lines, all added."""

    @staticmethod
    def of(response: dict, input_: dict, tool: str) -> list[dict]:
        hunks = response.get("structuredPatch", [])
        if not hunks:
            added = (input_.get("new_string", "") if tool == "Edit" else input_.get("content", "")).splitlines()
            return [{"kind": "add", "line": n, "text": line, "hidden": 0} for n, line in enumerate(added, 1)]
        rows = []
        for hunk in hunks:
            old, new = hunk.get("oldStart", 1), hunk.get("newStart", 1)
            for text in hunk.get("lines", []):
                mark, body = text[:1], text[1:]
                if mark == "+":
                    rows.append({"kind": "add", "line": new, "text": body, "hidden": 0})
                    new += 1
                elif mark == "-":
                    rows.append({"kind": "del", "line": old, "text": body, "hidden": 0})
                    old += 1
                else:
                    rows.append({"kind": "ctx", "line": new, "text": body, "hidden": 0})
                    new += 1
                    old += 1
        return rows
