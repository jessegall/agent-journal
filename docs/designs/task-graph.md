# Task graph

How the task graph of a plan behaves (`domain/Tasks/resources/js/pages/tasks/TaskGraph.vue`).

## The graph

- Each task is a node in the column of its wait depth, with an arrow from every task that must finish to the task that
  waits for it.
- Enter or Space on a node selects it, lights its whole chain both ways and fills the inspector. Escape clears it and
  gives the focus back to the node. Show bottlenecks marks the tasks the most others wait for.
- The inspector holds the task's facts, Open task (which returns here with the node selected) and Close. A task whose
  waits the caller may not change keeps its facts readable and its change action disabled with the reason.
- On a wide screen the canvas scrolls apart from the inspector; on a phone the inspector sits below.

## Suggestions

- A suggestion is asked for only where the props give an address for it; otherwise Suggest says why it is off.
- While it is asked for, Now stays in view; if the ask fails, Retry asks again.
- A suggestion draws Now and Suggested side by side (stacked on a phone), with the waits it adds and removes marked by
  shape and label, and the longest chain and the most tasks at once of each.
- Apply is there only with an address to apply to and the version the suggestion was made from. When the waits changed
  meanwhile, the comparison stays, says so and offers Reload and recompute.
- Undo is offered in a toast only with an address for it, and Discard goes back to the plain graph.
