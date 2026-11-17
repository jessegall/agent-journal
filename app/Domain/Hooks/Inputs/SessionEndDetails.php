<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Inputs;

final readonly class SessionEndDetails
{
    public function __construct(
        public SessionEndReason $reason,
    ) {}
}
