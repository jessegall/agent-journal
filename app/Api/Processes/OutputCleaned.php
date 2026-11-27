<?php

declare(strict_types=1);

namespace App\Api\Processes;

use Spatie\LaravelData\Data;

/**
 * What cleaning ended runs' output removed, or would remove in a preview.
 */
final class OutputCleaned extends Data
{
    /**
     * @param  list<string>  $runs
     * @param  list<string>  $parts
     */
    public function __construct(
        public readonly array $runs,
        public readonly array $parts,
        public readonly int $bytes,
        public readonly bool $isRemoved,
    ) {}
}
