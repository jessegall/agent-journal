---
name: commandments-work-stack-decision
description: A handler or listener that reads the agent's current work, builds a work frame reference or pushes work onto a stack. Read this when a work-stack-decision finding points here; the finding is advisory.
---

# Handlers change truth; states answer for the stack

A handler or listener changes domain truth. What the agent works on next is the work state's answer: its instruction,
read from the top live state that has one, and the commands it returns when a hook or a fact it listens to reaches it.

```php
// Before: a listener decides the stack itself
if ($this->stacks->current('tasks.working')->isEmpty()) {
    $this->stacks->push(WorkingOnTaskStateReference::forTask($task));
}

// After: the state answers from its own frame
public function instruction(): Option
{
    return new Some("Work on task {$this->task->number}.");
}
```

The documented owners stay: the start listeners of tasks, plans and sequences put the first frame on the stack in the
start's transaction, message recovery and the incoming work list recover held work, and ask attention coordinates
asks. A finding elsewhere is a question for review, not a proof: a push may be right where it is.
