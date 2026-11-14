import sqlite3

from engine.database.row_insert import RowInsert

TABLE = "docs"
TITLE_START_CHARACTERS = 80


class WholeTextDocuments:
    """Version 4 texts longer than their version 5 row holds, each moved whole into a document of its own; the
    row keeps the start of the text and the document's number."""

    def __init__(self, rows: RowInsert, limit_characters: int, model_name: str) -> None:
        self.rows, self.limit_characters, self.model_name = rows, limit_characters, model_name
        self.document_ids: list[int] = []

    def fitting_text(self, row: sqlite3.Row, creator_id: int, created: str) -> str:
        text: str = row["text"]
        if len(text) <= self.limit_characters:
            return text
        document_id = self.rows.insert(TABLE, {"creator_id": creator_id, "title": text[:TITLE_START_CHARACTERS].strip(),
                                               "abstract": f"The whole text of a version 4 {self.model_name}, longer than version 5 holds", "body": text,
                                               "created_at": created, "updated_at": row["updated_at"] or created})
        self.document_ids.append(document_id)
        ending = f" ... (whole text in doc {document_id})"
        return text[:self.limit_characters - len(ending)].rstrip() + ending

    def note(self) -> str:
        return f"{len(self.document_ids)} {self.model_name} texts longer than {self.limit_characters} characters moved whole into documents"
