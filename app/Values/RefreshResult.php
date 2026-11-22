<?php

declare(strict_types=1);

namespace App\Values;

/**
 * What one refresh did: the generation in use, whether the catalogue was unchanged so the previous one was reused,
 * whether it failed and why, and how many publications it asked for.
 */
final readonly class RefreshResult
{
    public function __construct(
        public string $generationId,
        public bool $reused,
        public bool $failed,
        public string $reason,
        public int $publications,
    ) {}
}
