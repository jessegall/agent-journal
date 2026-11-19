<?php

declare(strict_types=1);

namespace App\Processes\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The whole current state of one run with the number of the last live update it includes; a client that missed an
 * update starts again from a snapshot.
 */
#[TypeScript]
final class RunSnapshotData extends Data
{
    /**
     * @param  list<PartSnapshotData>  $parts
     */
    public function __construct(
        public readonly string $runId,
        public readonly int $sequence,
        public readonly string $mode,
        public readonly string $lifecycle,
        #[DataCollectionOf(PartSnapshotData::class)]
        public readonly array $parts,
    ) {}
}
