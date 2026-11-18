<?php

declare(strict_types=1);

namespace App\Processes\Values;

/**
 * What a clean removes, or removed: the runs, their parts and the bytes of stored output.
 */
final readonly class CleanPreview
{
    /**
     * @param  list<string>  $runIds
     * @param  list<string>  $partRunIds
     */
    public function __construct(
        public array $runIds,
        public array $partRunIds,
        public int $bytes,
        public bool $removed,
    ) {}
}
