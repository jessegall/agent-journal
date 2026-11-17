<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Inputs;

final readonly class StopDetails
{
    public function __construct(
        public string $turnId,
        public bool $isContinuation,
    ) {}
}
