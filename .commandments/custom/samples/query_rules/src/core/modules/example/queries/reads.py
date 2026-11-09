from core.base.model.table import loaded


def read_rows(query, ids):
    # @sin architecture_queries_read_in_a_loop
    rows = [query.find(row_id) for row_id in ids]
    # @sin architecture_queries_read_in_a_loop
    matches = (query.first() for row_id in ids)
    for row_id in ids:
        # @sin architecture_queries_read_in_a_loop
        row = query.find(row_id)
    for row_id in ids:
        # @sin architecture_queries_read_in_a_loop
        row = rows.required(Task, row_id)
    for row_id in ids:
        # @sin architecture_queries_read_in_a_loop
        known = query.filter(id=row_id).exists()
    for row_id in ids:
        # @sin architecture_queries_read_in_a_loop
        total = query.matching(row_id).count()
    # @righteous architecture_queries_read_in_a_loop
    held = [row for row in query.filter(id=1).all_rows()]
    # @righteous architecture_queries_read_in_a_loop
    present = [path for path in paths if path.exists()]
    # @righteous architecture_queries_read_in_a_loop
    by_id = rows.required_by_id(Task, ids)
    # @righteous architecture_queries_read_in_a_loop
    tasks = query.find_many(ids)
    # @righteous architecture_queries_read_in_a_loop
    first = query.first()
    # @sin architecture_queries_one_row_page
    page = query.page(1, 1).rows
    # @sin architecture_queries_one_row_page
    latest = query.newest().limited(1)
    # @righteous architecture_queries_one_row_page
    recent_rows = query.newest().limited(5)
    # @righteous architecture_queries_one_row_page
    page_rows = query.page(1, 25).rows
    # @righteous architecture_queries_one_row_page
    second_page = query.page(2, 1).rows
    # @sin architecture_model_loaded_outside_table
    old = loaded(str, "reviewing")
    # @righteous architecture_model_loaded_outside_table
    program = query.loaded()
