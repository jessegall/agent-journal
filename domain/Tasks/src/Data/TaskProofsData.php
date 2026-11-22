<?php

declare(strict_types=1);

namespace Domain\Tasks\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A page of a task's proofs, newest first, read after the proof it names ('' for the newest), with the cursor of the
 * next page while older proofs remain.
 */
#[TypeScript]
final class TaskProofsData extends Data
{
    /**
     * @param  list<TaskProofData>  $proofs
     */
    public function __construct(
        public readonly string $after,
        #[DataCollectionOf(TaskProofData::class)]
        public readonly array $proofs,
        public readonly string|Optional $nextAfter = new Optional(),
    ) {}
}
