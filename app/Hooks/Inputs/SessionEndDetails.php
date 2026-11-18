<?php

declare(strict_types=1);

namespace App\Hooks\Inputs;

use App\Hooks\Enums\SessionEndReason;

final readonly class SessionEndDetails
{
    public function __construct(
        public SessionEndReason $reason,
    ) {}
}
