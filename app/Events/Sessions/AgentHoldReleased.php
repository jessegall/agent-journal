<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Enums\Drivers\HoldReason;
use App\Support\ActorReference;

/**
 * A user released a runtime's hold: the audit record of which hold, who released it and why.
 */
final readonly class AgentHoldReleased implements SessionEvent
{
    public function __construct(
        public string $runtimeId,
        public HoldReason $hold,
        public ActorReference $actor,
        public string $reason,
    ) {}
}
