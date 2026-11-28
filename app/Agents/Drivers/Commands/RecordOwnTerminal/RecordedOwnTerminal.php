<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Commands\RecordOwnTerminal;

use App\Values\HostProcessPlan;

final readonly class RecordedOwnTerminal
{
    public function __construct(
        public string $processId,
        public HostProcessPlan $plan,
    ) {}
}
