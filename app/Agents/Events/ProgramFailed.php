<?php

declare(strict_types=1);

namespace App\Agents\Events;

use App\Agents\Enums\ProgramFailure;
use App\Contracts\Event;
use App\Contracts\ListenerFailureLog;
use App\Records\Support\RecordIdentity;
use App\Ui\Contracts\UserInterfaceUpdater;

/**
 * A start's program reported that a request failed, and why in its checked vocabulary, with the account by identity
 * and the sign-in generation its start ran in when it ran on one; the program's own error text stays private.
 */
final readonly class ProgramFailed implements Event, ListenerFailureLog, UserInterfaceUpdater
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public string $program,
        public ProgramFailure $failure,
        public RecordIdentity|null $account = null,
        public int|null $accountGeneration = null,
    ) {}
}
