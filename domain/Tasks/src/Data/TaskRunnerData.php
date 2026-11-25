<?php

declare(strict_types=1);

namespace Domain\Tasks\Data;

use Domain\Tasks\Values\TaskExecution;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The actor running a task's current run now, as the task reader names it; the label is absent when the caller may
 * not see that agent's name.
 */
#[TypeScript]
final class TaskRunnerData extends Data
{
    public function __construct(
        public readonly string $actorType,
        public readonly string $actorId,
        public readonly string|null $actorLabel,
    ) {}

    public static function fromExecution(TaskExecution $execution): self
    {
        return new self($execution->actorType, $execution->actorId, $execution->actorLabel);
    }
}
