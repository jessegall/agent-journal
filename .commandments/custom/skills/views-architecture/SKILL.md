---
name: ViewsArchitecture
description: Load it before declaring or reading a database view in version 5, or before changing the place of a phase or a task in a plan, so views stay declared once and positions stay without gaps.
summary: A view is a ViewModel with its view, key and select, read through Query; plan positions change only through Positions and the phase handlers.
tier: mandatory
languages: [python]
---

# The views architecture

Version 5 reads values worked out from rows through database views (doc 1097). Each view is declared once and
read like any table.

## When it fires

- **`view-model-without-select`** - a class extending ViewModel sets no `select`. Name the view, its key column and
  its SELECT on the view model, and the module lists the view model in `views`. Sync then compares its fields with
  the view's columns. A `views.py` keeps SELECT text only while the SQL detectors list it; that list only shrinks, so a
  new view builds its select with the query builder.
- **`second-view-reader`** - a class named View, ViewQuery or the like reads or declares views beside Query. Read a
  view with `queries.query(ViewModel)` like a table: where, order_by, take, page, every_row(reason), find by its key;
  get() returns at most 50 rows unless a limit up to 1000 is named.
- **`position-outside-positions`** - plans code sets `position=` outside `positions.py` and `phase_handlers.py`. Take a
  new place from `Positions`, renumber with it when a place leaves, and move a phase with `journal phase move`.
