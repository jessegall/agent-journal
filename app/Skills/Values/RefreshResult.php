<?php

declare(strict_types=1);

namespace App\Skills\Values;

/**
 * What one refresh did: the generation in use, whether the catalogue was unchanged so the previous one was reused,
 * whether it failed and why.
 */
final readonly class RefreshResult
{
    public function __construct(
        public string $generationId,
        public bool $isReused,
        public bool $hasFailed,
        public string $reason,
    ) {}
}
