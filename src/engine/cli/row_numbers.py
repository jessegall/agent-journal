class RowNumbers:
    """Turns the number a user or an agent wrote for a row into the row id the journal stores, inside one
    environment, and back. A module binds its own for the models it numbers; without one a number is the id."""

    def row_id(self, model_name: str, number: int, environment_id: int | None) -> int:
        return number

    def number(self, model_name: str, row_id: int) -> int:
        return row_id

    def environment_number(self, model_name: str, row_id: int, environment_id: int | None) -> int:
        return row_id

    def numbers(self, model_name: str, row_ids: set[int]) -> dict[int, int]:
        return {row_id: row_id for row_id in row_ids}
