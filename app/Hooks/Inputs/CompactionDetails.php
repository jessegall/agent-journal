<?php

declare(strict_types=1);

namespace App\Hooks\Inputs;

final readonly class CompactionDetails
{
    public function __construct(
        public string $compactionId,
    ) {}
}
