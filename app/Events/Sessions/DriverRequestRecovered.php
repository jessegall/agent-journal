<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\DriverRequestEvent;
use App\Agents\Drivers\Enums\RecoveryAction;
use App\Support\ActorReference;

/**
 * A user retried, cancelled or resolved a driver request: the audit record of who did what, and why.
 */
final readonly class DriverRequestRecovered implements DriverRequestEvent, SessionEvent
{
    public function __construct(
        public string $requestId,
        public RecoveryAction $action,
        public ActorReference $actor,
        public string $reason,
    ) {}
}
