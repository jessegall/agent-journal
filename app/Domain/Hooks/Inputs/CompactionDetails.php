<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Inputs;

final readonly class CompactionDetails
{
    public function __construct(
        public int $contextNumber,
    ) {}
}
