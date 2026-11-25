<?php

declare(strict_types=1);

namespace Domain\Tasks\Data;

use App\Enums\Assignments\ActorType;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Enums\TaskStreamEntryType;
use Domain\Tasks\Values\TaskLogLine;
use Domain\Tasks\Values\TaskTransition;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One entry of a task's Logs: a change of its state or a line its worker logged, with its time, who made it, and its
 * run, absent when the change belongs to no run. Its text is kept exactly as written.
 */
#[TypeScript]
final class TaskStreamEntryData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly TaskStreamEntryType $type,
        public readonly string $at,
        public readonly ActorType $actorType,
        public readonly string $actorId,
        public readonly int|Optional $runNumber = new Optional(),
        public readonly string|Optional $text = new Optional(),
        public readonly TaskState|Optional $fromState = new Optional(),
        public readonly TaskState|Optional $toState = new Optional(),
    ) {}

    public static function ofTransition(TaskTransition $transition): self
    {
        return self::from(array_filter([
            'id' => $transition->id,
            'type' => TaskStreamEntryType::Change,
            'at' => $transition->at->toIso8601String(),
            'actorType' => $transition->actorType,
            'actorId' => $transition->actorId,
            'runNumber' => $transition->runNumber,
            'text' => $transition->text,
            'fromState' => $transition->fromState,
            'toState' => $transition->toState,
        ], fn (mixed $entryValue) => $entryValue !== null));
    }

    public static function ofLine(TaskLogLine $line): self
    {
        return self::from([
            'id' => $line->id,
            'type' => TaskStreamEntryType::Log,
            'at' => $line->at->toIso8601String(),
            'actorType' => $line->actorType,
            'actorId' => $line->actorId,
            'runNumber' => $line->runNumber,
            'text' => $line->text,
        ]);
    }
}
