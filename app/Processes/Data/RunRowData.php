<?php

declare(strict_types=1);

namespace App\Processes\Data;

use App\Models\Runs\ProcessRun;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One run in the runs list: its operations, whether it is a normal run or evidence only, and its lifecycle.
 */
#[TypeScript]
final class RunRowData extends Data
{
    /**
     * @param  list<string>  $operations
     */
    public function __construct(
        public readonly string $id,
        public readonly string $mode,
        public readonly string $lifecycle,
        public readonly array $operations,
        public readonly string $startedAt,
    ) {}

    /**
     * @param  list<string>  $operations
     */
    public static function fromRun(ProcessRun $run, array $operations): self
    {
        $started = $run->started_at ?? $run->created_at;

        $startedAt = (string) $started?->toIso8601String();

        return new self($run->id, $run->mode->value, $run->lifecycle->value, $operations, $startedAt);
    }
}
