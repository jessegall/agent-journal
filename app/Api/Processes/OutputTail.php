<?php

declare(strict_types=1);

namespace App\Api\Processes;

use Spatie\LaravelData\Data;

/**
 * The last lines of a part's stream, as diagnostic output, and the bytes before them.
 */
final class OutputTail extends Data
{
    public function __construct(
        public readonly string $label,
        public readonly string $stream,
        public readonly string $text,
        public readonly int $before,
        public readonly int $end,
    ) {}
}
