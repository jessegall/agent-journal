<?php

declare(strict_types=1);

namespace App\Core\Hooks\Inputs;

use App\Core\Hooks\Enums\SessionEndReason;

final readonly class SessionEndDetails
{
    public function __construct(
        public SessionEndReason $reason,
    ) {}
}
