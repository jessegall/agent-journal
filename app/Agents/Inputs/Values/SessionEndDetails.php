<?php

declare(strict_types=1);

namespace App\Agents\Inputs\Values;

use App\Sessions\Enums\SessionEndReason;

final readonly class SessionEndDetails
{
    public function __construct(
        public SessionEndReason $reason,
    ) {}
}
