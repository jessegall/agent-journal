<?php

declare(strict_types=1);

namespace App\Values;

/**
 * Which reading of a part a live update carries: the reader revision and assessment it shows, and how far the reader
 * consumed each stream, so a client applies a newer reading and never mixes two.
 */
final readonly class PartProjection
{
    /**
     * @param  array<string, int>  $offsets
     */
    public function __construct(
        public string $partRunId,
        public string $readerRevisionId,
        public string $assessmentId,
        public array $offsets,
    ) {}
}
