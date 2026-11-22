<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Event;
use App\Enums\RecoveryAction;
use App\Support\ActorIdentity;

/**
 * A user retried, cancelled or resolved a driver request: the audit record of who did what, and why.
 */
final readonly class DriverRequestRecovered implements Event
{
    public function __construct(
        public string $requestId,
        public RecoveryAction $action,
        public ActorIdentity $actor,
        public string $reason,
    ) {}
}
