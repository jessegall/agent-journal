<?php

declare(strict_types=1);

namespace App\Support\Inputs\Values;

use App\Enums\SessionEndReason;

final readonly class SessionEndDetails
{
    public function __construct(
        public SessionEndReason $reason,
    ) {}
}
