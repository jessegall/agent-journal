<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One screen row as runs of one style; the host sends a row as the bare list of its runs.
 */
#[TypeScript]
final class ScreenRowData extends Data
{
    /**
     * @param  list<ScreenRunData>  $runs
     */
    public function __construct(
        #[DataCollectionOf(ScreenRunData::class)]
        public readonly array $runs,
    ) {}

    /**
     * @param  list<array<string, mixed>>  $runs
     */
    public static function fromRuns(array $runs): self
    {
        return new self(array_values(ScreenRunData::collect($runs)));
    }
}
