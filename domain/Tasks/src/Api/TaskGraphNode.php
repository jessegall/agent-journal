<?php

declare(strict_types=1);

namespace Domain\Tasks\Api;

use Domain\Tasks\Enums\TaskState;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One task of a graph: its facts, the address that opens it, and whether the caller may change the waits it has, with
 * the reason when they may not.
 */
#[TypeScript]
final class TaskGraphNode extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly int $number,
        public readonly string $title,
        public readonly TaskState $state,
        public readonly string $address,
        public readonly bool $mayEditWaits,
        public readonly string|Optional $reason = new Optional(),
    ) {}
}
