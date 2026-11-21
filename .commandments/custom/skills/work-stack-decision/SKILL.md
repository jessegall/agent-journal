---
name: commandments-work-stack-decision
description: A handler or listener that reads the agent's current work, builds a work frame reference or pushes work onto a stack. Read this when a work-stack-decision finding points here; the finding is advisory.
---

# Handlers change truth; states answer for the stack

A handler or listener changes domain truth. What the agent works on next is the work state's answer: it returns the
commands the engine runs when its frame is entered, resumed or exited, or when a fact it listens to arrives.

```php
// Before: a listener decides the stack itself
if ($this->stacks->current('tasks.working')->isEmpty()) {
    $this->stacks->push(WorkingOnTaskStateReference::forTask($task));
}

// After: the state answers on its own frame
public function onEnter(LifecycleContext $context): LifecycleCommands
{
    return LifecycleCommands::of(new FocusInstruction());
}
```

The documented owners stay: the start listeners of tasks, plans and sequences put the first frame on the stack in the
start's transaction, message recovery and the incoming work list recover held work, and ask attention coordinates
asks. A finding elsewhere is a question for review, not a proof: a push may be right where it is.
