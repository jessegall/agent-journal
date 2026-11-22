<?php

declare(strict_types=1);

namespace App\Support\Inputs\Values;

final readonly class CompactionDetails
{
    public function __construct(
        public string $compactionId,
    ) {}
}
