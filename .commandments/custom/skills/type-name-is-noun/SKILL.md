---
plugin: code-commandments
name: type-name-is-noun
description: A class, interface or enum named with a verb phrase about what its implementer does, such as RunsPipelines or ProvidesPages. Read this before naming a type, and when a type-name-is-noun finding points here.
---

# A type is named for what it is, never for what it does

A class, interface or enum is a thing, so its name is a noun for what it is or the role it plays: `PipelineRunner`,
`PageProvider`, `MessageSender`. A verb phrase about its implementer (`RunsPipelines`, `ProvidesPages`,
`SendsMessages`) describes a behaviour instead of naming the thing, and reads as a sentence about some other class
(rule 43).

A trait and an attribute keep verb names, since they say what the class using them does: `HasComments`,
`#[RequiresRequestKey]`.

## The fix

Name the role. A contract that stands for one class takes that class's name, and the class implements it through an
alias: `use App\Bus\Contracts\PipelineRunner as PipelineRunnerContract`. Rename with
`php tools/refactoring/move.php <Old> <New>` so every reference follows.

## Worked example

```php
----------[ Bad ]----------

interface RunsPipelines
{
    public function runSteps(array $steps, object $input, string $output): object;
}

----------[ Good ]----------

interface PipelineRunner
{
    public function runSteps(array $steps, object $input, string $output): object;
}
```
