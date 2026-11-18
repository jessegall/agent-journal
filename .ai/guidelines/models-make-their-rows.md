# Models make their own rows

A model makes and changes its own rows. Code outside a model never calls `Model::query()->create([...])`, `Model::create([...])` or `new Model` then `save()`, and never `update([...])` with a column array (rule 40).

- Each model has a named static constructor that says what happens, such as `Task::file($title, $brief, $creator)`, `Plan::draft(...)` or `Host::enroll(...)`. It takes values and objects, never a column array, and maps them to its columns itself.
- A change is a model method that names it, such as `$task->cancelWith($reason)`, never a column write from a handler or controller.
- Tests build rows through factories or the same named constructors.
