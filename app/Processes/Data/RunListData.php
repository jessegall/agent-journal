<?php

declare(strict_types=1);

namespace App\Processes\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * The project's newest runs the viewer may see.
 */
final class RunListData extends Data
{
    /**
     * @param  list<RunRowData>  $runs
     */
    public function __construct(
        #[DataCollectionOf(RunRowData::class)]
        public readonly array $runs,
    ) {}
}
