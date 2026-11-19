<?php

declare(strict_types=1);

namespace App\Processes\Calls;

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
        public array $runs,
        public array $parts,
        public int $bytes,
        public bool $removed,
    ) {}
}
