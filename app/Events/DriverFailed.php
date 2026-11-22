<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Event;
use App\Contracts\ListenerFailureLog;
use App\Contracts\UserInterfaceUpdater;
use App\Enums\DriverFailure;
use App\Support\RecordIdentity;

/**
 * A start's driver reported that a request failed, and why in its checked vocabulary, with the account by identity
 * and the sign-in generation its start ran in when it ran on one; the driver's own error text stays private.
 */
final readonly class DriverFailed implements Event, ListenerFailureLog, UserInterfaceUpdater
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public string $driver,
        public DriverFailure $failure,
        public RecordIdentity|null $account = null,
        public int|null $accountGeneration = null,
    ) {}
}
