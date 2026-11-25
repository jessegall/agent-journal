<?php

declare(strict_types=1);

namespace App\Api\Processes;

use Spatie\LaravelData\Data;

/**
 * Where a text occurs in a part's stream, as byte offsets.
 */
final class OutputMatches extends Data
{
    /**
     * @param  list<int>  $offsets
     */
    public function __construct(
        public readonly string $label,
        public readonly string $stream,
        public readonly array $offsets,
    ) {}
}
