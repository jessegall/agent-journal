<?php

declare(strict_types=1);

namespace App\Events\Processes;

/**
 * A piece of a part's output was stored and its row committed, so a reader may read up to its end.
 */
final readonly class OutputChunkCommitted implements ProcessEvent
{
    public function __construct(
        public string $partRunId,
        public string $stream,
        public int $offset,
        public int $length,
    ) {}
}
