import json
from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class ChatQuestions(Migration):
    """Each question asked before the chat read only messages gets its message, at the time it was asked, as a new one does."""

    number: ClassVar[int] = 8

    def apply(self, connection: Connection) -> None:
        for q in connection.all("SELECT * FROM questions"):
            key = f"question:{q['id']}"
            if connection.one("SELECT id FROM messages WHERE json_extract(data, '$.key') = ?", (key,)):
                continue
            data = {"kind": "question", "session": (q["created_by"] or "").partition(":")[2], "row": key, "n": q["id"], "options": json.loads(q["options"] or "[]"), "answer": q["answer"], "key": key}
            connection.execute("INSERT INTO messages (created_at, created_by, updated_at, updated_by, environment_id, author, text, idempotency, acknowledgement, files, captions, data) VALUES (?, ?, ?, ?, ?, ?, ?, '', 0, '[]', '{}', ?)",
                               (q["created_at"], q["created_by"], q["updated_at"], q["updated_by"], q["environment_id"], "system", q["text"], json.dumps(data)))
